import { GamestateVariables } from './gamestate-variables.js';
import { calculatePrice } from './purchase-logic.js';
import { generatorSpecs } from './generators.js';

class Gamestate {
    /**
     * Copy initializer or set everything to 0
     */
    constructor(initializer = null) {
        Object.values(GamestateVariables).forEach(variable => {
            this[variable] = initializer?.[variable] ?? 0
        })
    }

    copyAndRaiseProperty(gamestateVariable, count=1) {
        return new Gamestate({...this, [gamestateVariable]: this[gamestateVariable] + count})
    }

    canBuy(gamestateVariable) {
        return this[GamestateVariables.PEKONI] >= calculatePrice(gamestateVariable, this[gamestateVariable] + 1)
    }

    buy(gamestateVariable) {
        // Can't afford the thing
        if (!this.canBuy(gamestateVariable)) {
            throw new Error(`Not enough currency for ${gamestateVariable}`)
        }

        let newState = this.copyAndRaiseProperty(gamestateVariable)
        newState[GamestateVariables.PEKONI] -= calculatePrice(gamestateVariable, newState[gamestateVariable])
        
        return newState
    }

    add(gamestateVariable, count=1) {
        switch(gamestateVariable) {
            // Clicked the pig
            case GamestateVariables.PEKONI:
                return this.copyAndRaiseProperty(GamestateVariables.PEKONI, count)
            
            // Bought reset
            case GamestateVariables.RESET:
                if (count !== 1) { throw new Error(`count must be 1 if adding resets, count: ${count}`)}
                // TODO Implement resets
                throw new Error("Resetit ei toimi vielä! Jos tää lipsui pelin tuotantoversioon, oon pahoillani 😀 Ota yhteyttä sikatiimiin ASAP, pliis!")
            
            // Bought anything else
            default:
                // This function was called with something not in the GamestateVariables enum for whatever reason
                if (!(Object.values(GamestateVariables).includes(gamestateVariable))) {
                    throw new Error(`Invalid gamestate variable: ${JSON.stringify(gamestateVariable)}`)
                }
                if (count !== 1) { throw new Error(`count must be 1 if adding anything other than PEKONI, count: ${count}`)}
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
    
    stepInTime(milliseconds) {
        var generatedBacon = this.calculateBaconPerSecond() * (milliseconds / 1000)
        var newState = new Gamestate(this)
        newState[GamestateVariables.PEKONI] += generatedBacon
        return newState //{stepInTime: (temp) => {throw new Error("uusi olio on jeejee toimii tältä osin")}}
    }
}

export { Gamestate }