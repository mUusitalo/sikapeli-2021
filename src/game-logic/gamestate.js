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
        
        // This could be a lot prettier but it works.
        if (gamestateVariable === GamestateVariables.RESET) {
            // Create new gamestate with resets += 1 and everything else 0
            return new Gamestate({[GamestateVariables.RESET]: this[GamestateVariables.RESET] + 1})
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

    formatNumber(number) {
       return Math.log(number)<10 ? number.toFixed(0) : number.toExponential(2)
    }
    
    stepInTime(milliseconds) {
        var generatedBacon = this.calculateBaconPerSecond() * (milliseconds / 1000)
        var newState = new Gamestate(this)
        newState[GamestateVariables.PEKONI] += generatedBacon
        return newState //{stepInTime: (temp) => {throw new Error("uusi olio on jeejee toimii tältä osin")}}
    }
}

export { Gamestate }