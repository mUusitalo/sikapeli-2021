const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { doc, setDoc } = require('firebase/firestore');

const { Gamestate } = import('../src/game-logic/gamestate.js');

admin.initializeApp();

const MARGIN_OF_ERROR_IN_MILLISECONDS = 5000 // 5 seconds
const MAX_DELTA_TIME_SUM = 3000000 // 5 minutes

/**
 * Adds all of the given modifications to the given gamestate.
 * @param {Gamestate} oldGamestate - Old gamestate to which modifications are applied
 * @param {Array<{deltams: Number, gamestateVariable: String}>} listOfAdditions - List of modifications (additions) to the gamestate
 */
function buildGamestate(oldGamestate, listOfAdditions) {
    try {
        return listOfAdditions.reduce((state, {deltams, gamestateVariable}) =>
            state.stepInTime(deltams).add(gamestateVariable)
            , oldGamestate);
    } catch (e) {
        console.log(
            "Can't apply modifications to given gamestate.\n\
            This means that there's a bug or that the player tried to cheat."
        , e)
        return null;
    }
}
/**
 * Add margin of error to first modification to handle delays between the client and the backend
 */
function addMarginOfError(listOfAdditions) {
    listOfAdditions[0].deltams += MARGIN_OF_ERROR_IN_MILLISECONDS
    return listOfAdditions
}

function countTime(listOfAdditions) {
    return listOfAdditions.reduce((total, delta) => total + delta)
}

/**
 * Check that the total passed time in listOfAdditions is defined and below MAX_DELTA_TIME_SUM
 */
function totalDeltaTimeIsValid(listOfAdditions) {
    const totalDeltaTime = countTime(listOfAdditions)
    return totalDeltaTime && totalDeltaTime <= MAX_DELTA_TIME_SUM + MARGIN_OF_ERROR_IN_MILLISECONDS
}

/**
 * Verify that the gamestate received = require(the client can be reached b)y
 * applying the modifications received by the client to the old gamestate that is stored in the database
 */
const verifyGamestate = functions.https.onCall(async (data, context) => {
    const { listOfAdditions } = data
    
    // Get old gamestate = require(database or create a new on)e
    const oldGamestate = (await admin.firestore.collection('users').get(data.auth.uid)) ?? new Gamestate();

    // Check that the total time passed in listOfAdditions is valid
    if (!totalDeltaTimeIsValid) {return oldGamestate}

    const newState = buildGamestate(oldGamestate, addMarginOfError(listOfAdditions))
    // return old stored state if new state couldn't be generated
    if (!newState) return oldGamestate;

    await setDoc(doc(admin.firestore(), 'users', data.auth.uid), ...newState)

    return newState
});

module.exports = { verifyGamestate }