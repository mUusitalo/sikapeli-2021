import { GamestateVariables } from "./gamestate-variables";
import { generatorSpecs } from "./generators";

const PRICE_POWER = 2

/**
 * Calculates the price of the variableCount:th purhcaseable of type gamestateVariable.
 * Indexing of variableCount starts from 1 because it makes sense that 0 items costs 0.
 */
function calculatePrice(gamestateVariable, variableCount) {
    switch(true) {
        case (gamestateVariable === GamestateVariables.RESET):
            throw new Error("Resetit ei toimi vielä! Jos tää lipsui pelin tuotantoversioon, oon pahoillani 😀 Ota yhteyttä sikatiimiin ASAP, pliis!")

        case (gamestateVariable in generatorSpecs):
            return generatorSpecs[gamestateVariable].rate * Math.pow(variableCount, PRICE_POWER)

        default:
            throw new Error(`Invalid gamestate variable: ${gamestateVariable}`)
    }
}

export { calculatePrice }