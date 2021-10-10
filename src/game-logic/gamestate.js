import { GamestateVariables, ProductionRates} from './gamestate-variables.js'

function calculateGeneratedBacon(gamestate, frameTime) {
    const frameMultiplier = frameTime / 1000
    return Object
        .values(GamestateVariables.GENERATORS)
        .reduce((sum, valueName) =>
            sum + gamestate[valueName] * ProductionRates[valueName] * frameMultiplier,
            0
        )
}

/*
Steps adds bacon generated during one frame to the gamestate
*/
function stepOneFrame(gamestate, frameTime) {
    gamestate[GamestateVariables.PEKONI] += calculateGeneratedBacon(gamestate, frameTime)
    return gamestate
}

export { generateStartingGamestate, stepOneFrame }