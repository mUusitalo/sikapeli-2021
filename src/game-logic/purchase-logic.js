import { GamestateVariables } from "./gamestate-variables";
import { generatorSpecs } from "./generators";

const PRICE_POWER = 2
const PRICE_BASE_MULTIPLIER = 10
const RESET_PRICE = Math.pow(10, 15)

/**
 * Calculates the price of the variableCount:th purhcaseable of type gamestateVariable.
 * Indexing of variableCount starts from 1 because it makes sense that 0 items costs 0.
 */
function calculatePrice(gamestateVariable, variableCount) {
    switch(true) {
        case (gamestateVariable === GamestateVariables.RESET):
            return RESET_PRICE

        case (gamestateVariable in generatorSpecs):
            return generatorSpecs[gamestateVariable].rate * PRICE_BASE_MULTIPLIER * Math.pow(variableCount, PRICE_POWER)

        default:
            throw new Error(`Invalid gamestate variable: ${gamestateVariable}`)
    }
}

export { calculatePrice }