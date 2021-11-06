const { GamestateVariables } = require('./gamestate-variables.js') 

const generatorSpecs = {
    [GamestateVariables.REVOLVERI]: {
        rate: 0.4,
        basePrice: 39
    },

    [GamestateVariables.SALUUNA]: {
        rate: 0.8,
        basePrice: 170
    },

    [GamestateVariables.COWBOY]: {
        rate: 5,
        basePrice: 800
    },

    [GamestateVariables.SIKALAUMA]: {
        rate: 50,
        basePrice: 6500
    },

    [GamestateVariables.SIKAFARMI]: {
        rate: 300,
        basePrice: 50000
    },

    [GamestateVariables.KYLA]: {
        rate: 1100,
        basePrice: 342000
    },

    [GamestateVariables.KULTAKAIVOS]: {
        rate: 5000,
        basePrice: 1600000
    },

    [GamestateVariables.SIKAIMPERIUMI]: {
        rate: 24000,
        basePrice: 9000000
    },
}

module.exports = { generatorSpecs }