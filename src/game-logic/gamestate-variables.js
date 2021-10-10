const GamestateVariables = {
    PEKONI: 'pekoni',
    RESETIT: 'resetit',
    GENERATORS: {
        SIKALA: 'sikala',
        REVOLVERI: 'revolveri',
        COWBOYHATTU: 'cowboyhattu',
        BOOTSIT: 'bootsit',
        SALUUNA: 'saluuna',
        RAUTATIE: 'rautatie',
        RAUTATIEASEMA: 'rautatieasema',
        KULTAKAIVOS: 'kultakaivos',    
    }
}
Object.freeze(GamestateVariables)

const ProductionRates = {
    [GamestateVariables.GENERATORS.SIKALA]: 1,
    [GamestateVariables.GENERATORS.REVOLVERI]: 2,
    [GamestateVariables.GENERATORS.COWBOYHATTU]: 3,
    [GamestateVariables.GENERATORS.BOOTSIT]: 4,
    [GamestateVariables.GENERATORS.SALUUNA]: 5,
    [GamestateVariables.GENERATORS.RAUTATIE]: 6,
    [GamestateVariables.GENERATORS.RAUTATIEASEMA]: 7,
    [GamestateVariables.GENERATORS.KULTAKAIVOS]: 8,
}
Object.freeze(ProductionRates)

const startingGameState = {
        [GamestateVariables.PEKONI]: 0,
        [GamestateVariables.RESETIT]: 0,
        [GamestateVariables.GENERATORS]: {
            [GamestateVariables.GENERATORS.SIKALA]: 0,
            [GamestateVariables.GENERATORS.REVOLVERI]: 0,
            [GamestateVariables.GENERATORS.COWBOYHATTU]: 0,
            [GamestateVariables.GENERATORS.BOOTSIT]: 0,
            [GamestateVariables.GENERATORS.SALUUNA]: 0,
            [GamestateVariables.GENERATORS.RAUTATIE]: 0,
            [GamestateVariables.GENERATORS.RAUTATIEASEMA]: 0,
            [GamestateVariables.GENERATORS.KULTAKAIVOS]: 0,    
        }
}
Object.freeze(startingGameState)

export { GamestateVariables, ProductionRates, startingGameState }