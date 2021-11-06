const { GamestateVariables } = require('./gamestate-variables.js');
const { generatorSpecs } = require('./generators.js');

const RESET_BASE_PRICE = Math.pow(10, 15)
const KERROIN_BASE_PRICE = 500
const PRICE_BASE_MULTIPLIER = 2
const BASE_COUNT = 1.10

/**
 * Gets base price of any gamestateVariable except PEKONI
 */
function getBasePrice(gamestateVariable) {
    switch(true) {
        case (gamestateVariable === GamestateVariables.RESET):
            return RESET_BASE_PRICE

        case (gamestateVariable === GamestateVariables.KERROIN):
            return KERROIN_BASE_PRICE

        case (gamestateVariable in generatorSpecs):
            return generatorSpecs[gamestateVariable].basePrice

        default:
            throw new Error(`Invalid gamestate variable: ${gamestateVariable}`)
    }
}

/**
 * Calculates the price of the variableCount:th purhcaseable of type gamestateVariable.
 * Indexing of variableCount starts from 1 because it makes sense that 0 items costs 0.
 */
function calculatePrice(gamestateVariable, variableCount) {
    return getBasePrice(gamestateVariable) * PRICE_BASE_MULTIPLIER * Math.pow(BASE_COUNT, variableCount)
}


module.exports = { calculatePrice }