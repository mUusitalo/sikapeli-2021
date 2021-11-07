import { GamestateVariables } from "./gamestate-variables.js";
import { generatorSpecs } from "./generators.js";

const RESET_BASE_PRICE = Math.pow(10, 10)
const KERROIN_BASE_PRICE = 2500
const PRICE_BASE_MULTIPLIER = 1
const BASE_COUNT = 1.15
const KERROIN_PRICE_MULTIPLIER = 2

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
    if (gamestateVariable === GamestateVariables.KERROIN){
        return getBasePrice(gamestateVariable) * PRICE_BASE_MULTIPLIER * Math.pow(KERROIN_PRICE_MULTIPLIER, variableCount)
    } else {
        return getBasePrice(gamestateVariable) * PRICE_BASE_MULTIPLIER * Math.pow(BASE_COUNT, variableCount)
    }
}

export { calculatePrice }