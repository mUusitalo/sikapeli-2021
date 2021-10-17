import { GamestateVariables } from "./gamestate-variables"

const generatorSpecs = {
    [GamestateVariables.SIKALA]: {
        rate: 0.1,
    },

    [GamestateVariables.REVOLVERI]: {
        rate: 2,
    },

    [GamestateVariables.COWBOYHATTU]: {
        rate: 30,
    },

    [GamestateVariables.BOOTSIT]: {
        rate: 500,
    },

    [GamestateVariables.SALUUNA]: {
        rate: 10000,
    },

    [GamestateVariables.RAUTATIE]: {
        rate: 150000,
    },

    [GamestateVariables.RAUTATIEASEMA]: {
        rate: 3000000,
    },

    [GamestateVariables.KULTAKAIVOS]: {
        rate: 99999999,
    },
}

export { generatorSpecs, }