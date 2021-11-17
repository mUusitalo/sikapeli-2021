/* eslint-disable no-multi-str */
const functions = require('firebase-functions');
const { logger } = functions
const admin = require('firebase-admin');

const { GamestateVariables } = require('./game-logic/gamestate-variables.js')
const { Gamestate } = require('./game-logic/gamestate.js')
const { MARGIN_OF_ERROR_IN_MILLISECONDS, MAX_DELTA_TIME_SUM, MAX_CLICKS_PER_SECOND, } = require('./constants.js')

admin.initializeApp();

/**
 * Adds all of the given modifications to the given gamestate.
 * @param {Gamestate} oldGamestate - Old gamestate to which modifications are applied
 * @param {Array<{deltams: Number, gamestateVariable: String}>} modifications - List of modifications (additions) to the gamestate
 */
function buildGamestate(oldGamestate, modifications, idleTimeAfterModifications) {
    return modifications
        .reduce(
            (state, {deltaTime, modification, count}) =>
                state.stepInTime(deltaTime).add(modification, count),
            oldGamestate.stepInTime(MARGIN_OF_ERROR_IN_MILLISECONDS)
        )
        .stepInTime(idleTimeAfterModifications);
}

function countTime(modifications) {
    return modifications.reduce((total, modification) => {
        if (modification.deltaTime < 0) { throw new Error(`Modication deltaTime can't be negative! deltaTime: ${modification.deltaTime}`)}
        return total + modification.deltaTime
    }, 0)
}

/**
 * Check that the total passed time in modifications is defined and below MAX_DELTA_TIME_SUM
 */
function testTimeAndClicks(modifications, idleTime, serverTimeElapsed) {

    if (idleTime < 0) { throw new Error(`Idle time can't be negative! idleTime: ${idleTime}`) }
    const totalDeltaTime = countTime(modifications) + idleTime
    const clickCount = modifications
        .filter(m => m.modification === GamestateVariables.PEKONI) // Filter our everything except clicks
        .reduce((t, n) => t + n.count, 0) // Sum count
    
    // Click frequency doesn't exceed MAX_CLICKS_PER_SECOND
    const clickCountIsValid = (totalDeltaTime !== 0)
        && (clickCount * 1000 / totalDeltaTime <= MAX_CLICKS_PER_SECOND)

    // Total time spent doesn't exceed MAX_DELTA_TIME_SUM
    const totalDeltaTimeIsValid = (totalDeltaTime > 0
        && totalDeltaTime <= Math.min(MAX_DELTA_TIME_SUM, serverTimeElapsed) + MARGIN_OF_ERROR_IN_MILLISECONDS)
    
    if (!clickCountIsValid) {throw new Error(`Clicked too many times: ${clickCount} in ${totalDeltaTime}`)}
    if (!totalDeltaTimeIsValid) {throw new Error(
        `Too much time between updates: ${(totalDeltaTime / 1000).toFixed(1)} seconds.\n\
        Server time difference was ${(serverTimeElapsed / 1000).toFixed(1)} seconds.\n\
        Maximum is ${(MAX_DELTA_TIME_SUM / 1000).toFixed(1)} seconds.`
    )}

    return clickCount
}

async function writeToDatabase({data, auth}) {
    return admin
        .firestore()
        .collection('users')
        .doc(auth.uid)
        .set(data)
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
const verifyGamestate = functions
    .runWith({memory: "256MB", timeoutSeconds: 10})
    .region('europe-central2')
    .https
    .onCall(async (args, context) => {
        // Return empty gamestate if user is not authenticated. 
        if (!context?.auth?.uid) {
            logger.error("No authentication")
            return new Gamestate()
        }

        const currentTime = admin.firestore.Timestamp.now().toMillis()

        const { modifications = [], idleTimeAfterModifications = 0 } = args

        /** 
         * Read gamestate and timestamp from database.
         * ?? {} is there because readFromDatabase might return undefined.
         * Timestamp can be null if it's the user's first update.
         * Therefore we assume the time to be MAX_DELTA_TIME_SUM milliseconds before the current time
        */
        let {
            gamestate: plainGamestate,
            timestamp=currentTime-MAX_DELTA_TIME_SUM,
            successfulCallCount=0,
            clickCount=0
        } = await readFromDatabase(context.auth) ?? {}

        // Convert plain JS object into Gamestate class instance
        const oldGamestate = new Gamestate(plainGamestate)
        
        /**
         * Return old gamestate from database if the user hasn't sent an update in MAX_DELTA_TIME_SUM
         * or if the time spent by the client is longer than the server time since the previous update.
         * This is necessary to prevent cheating.
        */
        try {
            clickCount += testTimeAndClicks(modifications, idleTimeAfterModifications, currentTime - timestamp)
        } catch (e) {
            logger.error("Error in testTimeAndClicks: ", {error: e.message, oldGamestate, modifications, idleTimeAfterModifications, auth: context.auth})
            return oldGamestate
        }

        /**
         * Build new gamestate by applying modifications to the old one.
         * This will be equal to the old gamestate if the modifications couldn't be applied (attempted cheating or a bug).
         */
        let newGamestate
        try {
            newGamestate = buildGamestate(oldGamestate, modifications, idleTimeAfterModifications)
        } catch(e) {
            logger.error("Error in buildGamestate: ", {error: e.message, oldGamestate, modifications, idleTimeAfterModifications, auth: context.auth})
            return oldGamestate
        }
        
        // Gamestate has to be converted to a plain JS object to write it to Firestore.
        writeToDatabase({
            auth: context.auth,
            data: {
                gamestate: {...newGamestate},
                timestamp: currentTime,
                successfulCallCount: successfulCallCount + 1,
                clickCount
            }
        })

        // Return updated and verified gamestate to client
        return newGamestate
});

module.exports = { verifyGamestate }