/* eslint-disable no-multi-str */
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const MARGIN_OF_ERROR_IN_MILLISECONDS = 5000 // 5 seconds
const MAX_DELTA_TIME_SUM = 3000000 // 5 minutes

/**
 * Adds all of the given modifications to the given gamestate.
 * @param {Gamestate} oldGamestate - Old gamestate to which modifications are applied
 * @param {Array<{deltams: Number, gamestateVariable: String}>} modifications - List of modifications (additions) to the gamestate
 */
function buildGamestate(oldGamestate, modifications, idleTimeAfterModifications) {
    try {
        modifications = addMarginOfError(modifications)
        return modifications.reduce((state, {deltaTime, modification}) =>
            state.stepInTime(deltaTime).add(modification), oldGamestate)
            .stepInTime(idleTimeAfterModifications);
    } catch (e) {
        console.log(
            "Can't apply modifications to given gamestate.\n\
            This means that there's a bug or that the player tried to cheat."
        , e)
        return oldGamestate;
    }
}

/**
 * Add margin of error to first modification to handle delays between the client and the backend
 */
function addMarginOfError(modifications) {
    if (modifications.length === 0) return []
    const copy = [...modifications]
    copy[0].deltaTime += MARGIN_OF_ERROR_IN_MILLISECONDS
    return copy
}

function countTime(modifications) {
    return modifications.reduce((total, modification) => total + modification.deltaTime, 0)
}

/**
 * Check that the total passed time in modifications is defined and below MAX_DELTA_TIME_SUM
 */
function totalDeltaTimeIsValid(modifications, idleTime, serverTimeElapsed) {
    const totalDeltaTime = countTime(modifications) + idleTime
    return totalDeltaTime <= Math.min(MAX_DELTA_TIME_SUM, serverTimeElapsed) + MARGIN_OF_ERROR_IN_MILLISECONDS
}

async function writeToDatabase(auth, gamestate, timestamp) {
    return admin
        .firestore()
        .collection('users')
        .doc(auth.uid)
        .set({gamestate,timestamp})
}

async function readFromDatabase(auth) {
    return admin
        .firestore()
        .collection('users')
        .get(auth.uid)
}

/**
 * Verify that the gamestate received from the client can be reached by
 * applying the modifications received to the old gamestate that is stored in the database.
 * May or may not update gamestate to database depending on validity.
 * Always returns a valid new gamestate (or an empty one).
 */
const verifyGamestate = functions.https.onCall(async (data, context) => {
    const { Gamestate } = await import('../src/game-logic/gamestate.js')

    // Return empty gamestate if user is not authenticated. 
    if (!context?.auth?.uid) {return console.log("no auth") || new Gamestate()}
    console.log(context.auth.uid)

    const { modifications = [], idleTimeAfterModifications = 0 } = data
    
    // Get old gamestate and previous update time from database.
    let { gamestate: plainGamestate, timestamp } = await readFromDatabase(context.auth)
    const oldGamestate = new Gamestate(plainGamestate)

    const currentTime = Date.now()

    /* Timestamp can be null if it's the user's first update.
    * Therefore we assume the time to be MAX_DELTA_TIME_SUM milliseconds before the current time
    */
    timestamp = timestamp ?? currentTime - MAX_DELTA_TIME_SUM

    if (!totalDeltaTimeIsValid(modifications, idleTimeAfterModifications, currentTime - timestamp)) { return oldGamestate }

    const newGamestate = buildGamestate(oldGamestate, modifications, idleTimeAfterModifications)
    // return old stored state if new state couldn't be generated
    
    writeToDatabase(context.auth, {...newGamestate}, currentTime)

    return newGamestate
});

module.exports = { verifyGamestate }