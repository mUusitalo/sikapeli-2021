/* eslint-disable no-multi-str */
const functions = require('firebase-functions');
const admin = require('firebase-admin');

const { GamestateVariables } = require('./game-logic/gamestate-variables.js')
const { Gamestate } = require('./game-logic/gamestate.js')

admin.initializeApp();

const MARGIN_OF_ERROR_IN_MILLISECONDS = 5000 // 5 seconds
const MAX_DELTA_TIME_SUM = 300000 // 5 minutes
const MAX_CLICKS_PER_SECOND = 50

/**
 * Adds all of the given modifications to the given gamestate.
 * @param {Gamestate} oldGamestate - Old gamestate to which modifications are applied
 * @param {Array<{deltams: Number, gamestateVariable: String}>} modifications - List of modifications (additions) to the gamestate
 */
function buildGamestate(oldGamestate, modifications, idleTimeAfterModifications) {
    try {
        modifications = addMarginOfError(modifications)
        return modifications
            .reduce((state, {deltaTime, modification, count}) =>
                state.stepInTime(deltaTime).add(modification, count), oldGamestate)
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
async function spentTimeAndClicksAreValid(modifications, idleTime, serverTimeElapsed) {

    const totalDeltaTime = countTime(modifications) + idleTime
    const clickCount = modifications
        .filter(m => m.modification === GamestateVariables.PEKONI) // Filter our everything except clicks
        .reduce((t, n) => t + n.count, 0) // Sum count
    
    // Click frequency doesn't exceed MAX_CLICKS_PER_SECOND
    const clickCountIsValid = clickCount * 1000 / totalDeltaTime <= MAX_CLICKS_PER_SECOND

    // Total time spent doesn't exceed MAX_DELTA_TIME_SUM
    const totalDeltaTimeIsValid = totalDeltaTime <= Math.min(MAX_DELTA_TIME_SUM, serverTimeElapsed) + MARGIN_OF_ERROR_IN_MILLISECONDS
    
    if (!clickCountIsValid) {console.log(`Clicked too many times: ${clickCount}`)}
    if (!totalDeltaTimeIsValid) {console.log(
        `Too much time between updates: ${(totalDeltaTime / 1000).toFixed(1)} seconds.\n\
        Server time difference was ${(serverTimeElapsed / 1000).toFixed(1)} seconds.\n\
        Maximum is ${(MAX_DELTA_TIME_SUM / 1000).toFixed(1)} seconds.`
    )}

    return clickCountIsValid && totalDeltaTimeIsValid
}

async function writeToDatabase(auth, gamestate, timestamp) {
    return admin
        .firestore()
        .collection('users')
        .doc(auth.uid)
        .set({gamestate,timestamp})
}

async function readFromDatabase(auth) {
    return (await admin
        .firestore()
        .doc(`users/${auth.uid}`)
        .get('server'))
        .data()
}

/**
 * Verify that the gamestate received from the client can be reached by
 * applying the modifications received to the old gamestate that is stored in the database.
 * May or may not update gamestate to database depending on validity.
 * Always returns a valid new gamestate (or an empty one).
 */
const verifyGamestate = functions.https.onCall(async (args, context) => {

    // Return empty gamestate if user is not authenticated. 
    if (!context?.auth?.uid) {
        console.log("No authentication")
        return new Gamestate()
    }

    const { modifications = [], idleTimeAfterModifications = 0 } = args
    /** 
     * Read gamestate and timestamp from database.
     * ?? {} is there because readFromDatabase might return undefined.
    */
    let {gamestate: plainGamestate, timestamp} = await readFromDatabase(context.auth) ?? {}
    //console.log("Old gamestate from database:", plainGamestate, timestamp)

    // Convert plain JS object into Gamestate class instance
    const oldGamestate = new Gamestate(plainGamestate)

    const currentTime = Date.now()
    /**
     * Timestamp can be null if it's the user's first update.
     * Therefore we assume the time to be MAX_DELTA_TIME_SUM milliseconds before the current time
    */
    timestamp = timestamp ?? currentTime - MAX_DELTA_TIME_SUM


    /**
     * Return old gamestate from database if the user hasn't sent an update in MAX_DELTA_TIME_SUM
     * or if the time spent by the client is longer than the server time since the previous update.
     * This is necessary to prevent cheating.
    */
    if (!(await spentTimeAndClicksAreValid(modifications, idleTimeAfterModifications, currentTime - timestamp))) {
        console.log("spentTimeAndClicksAreValid is not valid!")
        return oldGamestate
    }

    /**
     * Build new gamestate by applying modifications to the old one.
     * This will be equal to the old gamestate if the modifications couldn't be applied (attempted cheating or a bug).
     */
    const newGamestate = buildGamestate(oldGamestate, modifications, idleTimeAfterModifications)
    
    // Gamestate has to be converted to a plain JS object to write it to Firestore.
    writeToDatabase(context.auth, {...newGamestate}, currentTime)

    // Return updated and verified gamestate to client
    return newGamestate
});

module.exports = { verifyGamestate }