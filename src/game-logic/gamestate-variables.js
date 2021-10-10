const GamestateVariables = {
    KLIKIT: 'klikit',
    RESETIT: 'resetit',
    SIKALA: 'sikala',
    REVOLVERI: 'revolveri',
    COWBOYHATTU: 'cowboyhattu',
    BOOTSIT: 'bootsit',
    SALUUNA: 'saluuna',
    RAUTATIE: 'rautatie',
    RAUTATIEASEMA: 'rautatieasema',
    KULTAKAIVOS: 'kultakaivos',
}

const ProductionRates = {
    [GamestateVariables.SIKALA]: 1,
    [GamestateVariables.REVOLVERI]: 2,
    [GamestateVariables.COWBOYHATTU]: 3,
    [GamestateVariables.BOOTSIT]: 4,
    [GamestateVariables.SALUUNA]: 5,
    [GamestateVariables.RAUTATIE]: 6,
    [GamestateVariables.RAUTATIEASEMA]: 7,
    [GamestateVariables.KULTAKAIVOS]: 8,
}

export { GamestateVariables, ProductionRates }