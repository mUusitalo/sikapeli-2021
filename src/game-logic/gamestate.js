import { GamestateVariables, generatorSpecs } from './gamestate-variables.js'
import { calculatePrice } from './purchase-logic.js'

class Gamestate {
    /**
     * Copy initializer or set everything to 0
     */
    constructor(initializer = null) {
        Object.values(GamestateVariables).forEach(variable => {
            this[variable] = initializer?.[variable] ?? 0
        })
    }

    copyAndRaisePropertyByOne(gamestateVariable) {
        return new Gamestate({...this, [gamestateVariable]: this[gamestateVariable] + 1})
    }

    canBuy(gamestateVariable) {
        return this.bacon >= calculatePrice(gamestateVariable, this[gamestateVariable])
    }

    buy(gamestateVariable) {
        // Can't afford the thing
        if (!this.canBuy(gamestateVariable)) {
            throw new Error(`Not enough currency for ${gamestateVariable}`)
        }

        let newState = this.copyAndRaisePropertyByOne(gamestateVariable)
        newState[GamestateVariables.PEKONI] -= calculatePrice(gamestateVariable, newState[gamestateVariable])
        
        return newState
    }

    add(gamestateVariable) {
        switch(gamestateVariable) {
            // Clicked the pig
            case GamestateVariables.PEKONI:
                return this.copyAndRaisePropertyByOne(GamestateVariables.PEKONI)
            
            // Bought reset
            case GamestateVariables.RESET:
                // TODO Implement resets
                throw new Error("Resetit ei toimi vielä! Jos tää lipsui pelin tuotantoversioon, oon pahoillani 😀 Ota yhteyttä sikatiimiin ASAP, pliis!")
            
            // Bought anything else
            default:
                // This function was called with something not in the GamestateVariables enum for whatever reason
                if (!(gamestateVariable in Object.values(GamestateVariables))) {
                    throw new Error(`Invalid gamestate variable: ${gamestateVariable}`)
                }

                return this.buy(gamestateVariable)
        }
    }

    calculateBaconPerSecond() {
        return Object
            .keys(generatorSpecs)
            .reduce((sum, valueName) =>
                sum + this[valueName] * generatorSpecs[valueName].rate,
                0
            )
    }
    
    stepOneFrame(frameTimeinMilliseconds) {
        var generatedBacon = this.calculateBaconPerSecond() * (frameTimeinMilliseconds / 1000)
        var newState = new Gamestate(this)
        newState[GamestateVariables.PEKONI] += generatedBacon
        return newState
    }
}

export { Gamestate, }