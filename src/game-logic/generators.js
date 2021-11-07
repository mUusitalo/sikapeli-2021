import { GamestateVariables } from "./gamestate-variables.js"

const generatorSpecs = {
    [GamestateVariables.REVOLVERI]: {
        rate: 0.4,
        basePrice: 39
    },

    [GamestateVariables.SALUUNA]: {
        rate: 1.2,
        basePrice: 300
    },

    [GamestateVariables.COWBOY]: {
        rate: 6,
        basePrice: 1622.61
    },

    [GamestateVariables.SIKALAUMA]: {
        rate: 50,
        basePrice: 10000
    },

    [GamestateVariables.SIKAFARMI]: {
        rate: 470,
        basePrice: 90000
    },

    [GamestateVariables.KYLA]: {
        rate: 1100,
        basePrice: 340000
    },

    [GamestateVariables.KULTAKAIVOS]: {
        rate: 8000,
        basePrice: 3600000
    },

    [GamestateVariables.SIKAIMPERIUMI]: {
        rate: 60000,
        basePrice: 25000000
    },
}

export { generatorSpecs, }
