import { GamestateVariables } from "./gamestate-variables.js"

const generatorSpecs = {
    [GamestateVariables.REVOLVERI]: {
        rate: 0.4,
        basePrice: 30
    },

    [GamestateVariables.SALUUNA]: {
        rate: 0.8,
        basePrice: 120
    },

    [GamestateVariables.COWBOY]: {
        rate: 1,
        basePrice: 600
    },

    [GamestateVariables.SIKALAUMA]: {
        rate: 2,
        basePrice: 2500
    },

    [GamestateVariables.SIKAFARMI]: {
        rate: 5,
        basePrice: 10000
    },

    [GamestateVariables.KYLA]: {
        rate: 25,
        basePrice: 50000
    },

    [GamestateVariables.KULTAKAIVOS]: {
        rate: 60,
        basePrice: 200000
    },

    [GamestateVariables.SIKAIMPERIUMI]: {
        rate: 300,
        basePrice: 1000000
    },
}

export { generatorSpecs, }