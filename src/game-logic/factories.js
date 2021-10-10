const Factories = {
    SIKALA: 1,
    REVOLVERI: 2,
    COWBOYHATTU: 3,
    BOOTSIT: 4,
    SALUUNA: 5,
    RAUTATIE: 6,
    RAUTATIEASEMA: 7,
    KULTAKAIVOS: 8,
    /*
    SIKAMAFIA: 9,
    SIKAIMPERIUMI: 10,
    Muita tähän?
    */
}

const FactoryProductionRates = {
    Factories.SIKALA: 1,
    Factories.REVOLVERI: 3,
    Factories.COWBOYHATTU: 10,
    Factories.BOOTSIT: 50,
    Factories.SALUUNA: 300,
    Factories.RAUTATIE: 1000,
    Factories.RAUTATIEASEMA: 8000,
    Factories.KULTAKAIVOS: 50000,
}

export { Factories, FactoryProductionRates }