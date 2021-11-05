import { GamestateVariables } from "./gamestate-variables.js";
import { generatorSpecs } from "./generators.js";

const RESET_PRICE = Math.pow(10, 15)
const PRICE_BASE_MULTIPLIER = 2
const BASE_COUNT = 1.10

/**
 * Calculates the price of the variableCount:th purhcaseable of type gamestateVariable.
 * Indexing of variableCount starts from 1 because it makes sense that 0 items costs 0.
 */

function calculatePrice(gamestateVariable, variableCount) {
    switch(true) {
        case (gamestateVariable === GamestateVariables.RESET):
            return RESET_PRICE

        case (gamestateVariable in generatorSpecs):
            return generatorSpecs[gamestateVariable].basePrice * PRICE_BASE_MULTIPLIER * Math.pow(BASE_COUNT, variableCount)

        default:
            throw new Error(`Invalid gamestate variable: ${gamestateVariable}`)
    }
}

export { calculatePrice }