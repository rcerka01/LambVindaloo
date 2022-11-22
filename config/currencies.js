// 27.10.22
const toGBP = {
    CHF: 0.87,
    HUF: 0.0021,
    PLN: 0.18,
    EUR: 0.87,
    CZK: 0.035,
    MXN: 0.043,
    RON: 0.18,
    USD: 0.86,
    AUD: 0.56,
    CAD: 0.64,
    NZD: 0.5,
    JPY: 0.0059,
    ZAR: 0.048,
    TRY: 0.046,
    BRL: 0.16,
    NOK: 0.084,
    SEK: 0.079
}

module.exports = {
    mapper: [
        // MAJOR
        // used in past
        { //1
            id: 1,
            name: "USDCHF",
            lot: 100000,
            leverage: 30,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: toGBP.USD,
            pipToGBP: toGBP.CHF,
            enabled: true
        },
        { //2
            id: 2,
            name: "EURUSD",
            lot: 100000,
            leverage: 30,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: toGBP.EUR,
            pipToGBP: toGBP.USD,
            enabled: false
        },
        { //3
            id: 3,
            name: "EURCHF",
            lot: 100000,
            leverage: 30,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: toGBP.EUR,
            pipToGBP: toGBP.CHF,
            enabled: false
        },
        { //4
            id: 4,
            name: "GBPUSD",
            lot: 100000,
            leverage: 30,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: 1,
            pipToGBP: toGBP.USD,
            enabled: false
        },
        { //5
            id: 5,
            name: "USDCAD",
            lot: 100000,
            leverage: 30,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: toGBP.USD,
            pipToGBP: toGBP.CAD,
            enabled: false
        },
        { //6
            id: 6,
            name: "AUDUSD",
            lot: 100000,
            leverage: 20,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: toGBP.AUD,
            pipToGBP: toGBP.USD,
            enabled: false
        },
        { //7
            id: 7,
            name: "NZDUSD",
            lot: 100000,
            leverage: 20,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: toGBP.NZD,
            pipToGBP: toGBP.USD,
            enabled: false
        },
        // not used in past 
        { //8
            id: 8,
            name: "EURGBP",
            lot: 100000,
            leverage: 30,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: toGBP.EUR,
            pipToGBP: 1,
            enabled: false
        },
        { //9
            id: 9,
            name: "GBPCHF",
            lot: 100000,
            leverage: 30,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: 1,
            pipToGBP: toGBP.CHF,
            enabled: false
        },
        { //10
            id: 48,
            name: "EURJPY",
            lot: 100000,
            leverage: 30,
            pip: 0.01,
            value: 0.1,
            marginToGBP: toGBP.EUR,
            pipToGBP: toGBP.JPY,
            enabled: false
        },
        { //11
            id: 49,
            name: "GBPJPY",
            lot: 100000,
            leverage: 30,
            pip: 0.01,
            value: 0.1,
            marginToGBP: 1,
            pipToGBP: toGBP.JPY,
            enabled: false
        },
        { //12
            id: 50,
            name: "USDJPY",
            lot: 100000,
            leverage: 30,
            pip: 0.01,
            value: 0.1,
            marginToGBP: toGBP.USD,
            pipToGBP: toGBP.JPY,
            enabled: false
        },

        // MINOR
        { //1
            id: 10,
            name: "AUDCAD",
            lot: 100000,
            leverage: 20,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: toGBP.AUD,
            pipToGBP: toGBP.CAD,
            enabled: false
        },
        { //2
            id: 11,
            name: "AUDCHF",
            lot: 100000,
            leverage: 20,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: toGBP.AUD,
            pipToGBP: toGBP.CHF,
            enabled: false
        },
        { //3
            id: 12,
            name: "AUDNZD",
            lot: 100000,
            leverage: 20,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: toGBP.AUD,
            pipToGBP: toGBP.NZD,
            enabled: false
        },
        { //4
            id: 13,
            name: "CADCHF",
            lot: 100000,
            leverage: 30,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: toGBP.CAD,
            pipToGBP: toGBP.CHF,
            enabled: false
        },
        { //5
            id: 14,
            name: "EURAUD",
            lot: 100000,
            leverage: 20,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: toGBP.EUR,
            pipToGBP: toGBP.AUD,
            enabled: false
        },
        { //6
            id: 15,
            name: "EURCAD",
            lot: 100000,
            leverage: 30,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: toGBP.EUR,
            pipToGBP: toGBP.CAD,
            enabled: false
        },
        { //7
            id: 16,
            name: "EURNOK",
            lot: 100000,
            leverage: 20,
            pip: 0.01,
            value: 0.1,
            marginToGBP: toGBP.EUR,
            pipToGBP: toGBP.NOK,
            enabled: false
        },
        { //8
            id: 17,
            name: "EURNZD",
            lot: 100000,
            leverage: 20,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: toGBP.EUR,
            pipToGBP: toGBP.NZD,
            enabled: false
        },
        { //9
            id: 18,
            name: "EURSEK",
            lot: 100000,
            leverage: 20,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: toGBP.EUR,
            pipToGBP: toGBP.SEK,
            enabled: false
        },
        { //10
            id: 19,
            name: "GBPAUD",
            lot: 100000,
            leverage: 20,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: 1,
            pipToGBP: toGBP.AUD,
            enabled: false
        },
        { //11
            id: 20,
            name: "GBPCAD",
            lot: 100000,
            leverage: 30,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: 1,
            pipToGBP: toGBP.CAD,
            enabled: false
        },
        { //12
            id: 21,
            name: "GBPNZD",
            lot: 100000,
            leverage: 20,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: 1,
            pipToGBP: toGBP.NZD,
            enabled: false
        },
        { //13
            id: 22,
            name: "NZDCAD",
            lot: 100000,
            leverage: 20,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: toGBP.NZD,
            pipToGBP: toGBP.CAD,
            enabled: false
        },
        { //14
            id: 23,
            name: "NZDCHF",
            lot: 100000,
            leverage: 20,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: toGBP.NZD,
            pipToGBP: toGBP.CHF,
            enabled: false
        },
        { //15
            id: 26,
            name: "USDNOK",
            lot: 100000,
            leverage: 20,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: toGBP.USD,
            pipToGBP: toGBP.NOK,
            enabled: false
        },
        { //16
            id: 27,
            name: "USDSEK",
            lot: 100000,
            leverage: 20,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: toGBP.USD,
            pipToGBP: toGBP.SEK,
            enabled: false
        },
        { //17
            id: 51,
            name: "AUDJPY",
            lot: 100000,
            leverage: 20,
            pip: 0.01,
            value: 0.1,
            marginToGBP: toGBP.AUD,
            pipToGBP: toGBP.JPY,
            enabled: false
        },
        { //18
            id: 52,
            name: "CADJPY",
            lot: 100000,
            leverage: 20,
            pip: 0.01,
            value: 0.1,
            marginToGBP: toGBP.CAD,
            pipToGBP: toGBP.JPY,
            enabled: false
        },
        { //19
            id: 53,
            name: "CHFJPY",
            lot: 100000,
            leverage: 30,
            pip: 0.01,
            value: 0.1,
            marginToGBP: toGBP.CHF,
            pipToGBP: toGBP.JPY,
            enabled: false
        },
        { //20
            id: 54,
            name: "NZDJPY",
            lot: 100000,
            leverage: 20,
            pip: 0.01,
            value: 0.1,
            marginToGBP: toGBP.NZD,
            pipToGBP: toGBP.JPY,
            enabled: false
        },

        // EMERGING
        { //1
            id: 28,
            name: "CHFHUF",
            lot: 100000,
            leverage: 20,
            pip: 0.01,
            value: 0.1,
            marginToGBP: toGBP.CHF,
            pipToGBP: toGBP.HUF,
            enabled: false
        },
        { //2
            id: 29,
            name: "CHFPLN",
            lot: 100000,
            leverage: 20,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: toGBP.CHF,
            pipToGBP: toGBP.PLN,
            enabled: false
        },
        {  //3
            id: 30,
            name: "EURCZK",
            lot: 100000,
            leverage: 20,
            pip: 0.01,
            value: 0.1,
            marginToGBP: toGBP.EUR,
            pipToGBP: toGBP.CZK,
            enabled: false
        },
        { //4
            id: 31,
            name: "EURHUF",
            lot: 100000,
            leverage: 20,
            pip: 0.01,
            value: 0.1,
            marginToGBP: toGBP.EUR,
            pipToGBP: toGBP.HUF,
            enabled: false
        },
        {  //5
            id: 32,
            name: "EURMXN",
            lot: 100000,
            leverage: 20,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: toGBP.EUR,
            pipToGBP: toGBP.MXN,
            enabled: false
        },
        { //6
            id: 33,
            name: "EURPLN",
            lot: 100000,
            leverage: 20,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: toGBP.EUR,
            pipToGBP: toGBP.PLN,
            enabled: false
        },
        { //7
            id: 34,
            name: "EURRON",
            lot: 100000,
            leverage: 20,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: toGBP.EUR,
            pipToGBP: toGBP.RON,
            enabled: false
        },
        { //8
            id: 35,
            name: "EURTRY",
            lot: 100000,
            leverage: 20,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: toGBP.EUR,
            pipToGBP: toGBP.TRY,
            enabled: false
        },
        { //9
            id: 36,
            name: "EURZAR",
            lot: 100000,
            leverage: 20,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: toGBP.EUR,
            pipToGBP: toGBP.ZAR,
            enabled: false
        },
        { //10
            id: 37,
            name: "GBPMXN",
            lot: 100000,
            leverage: 20,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: 1,
            pipToGBP: toGBP.MXN,
            enabled: false
        },
        { //11
            id: 38,
            name: "GBPPLN",
            lot: 100000,
            leverage: 20,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: 1,
            pipToGBP: toGBP.PLN,
            enabled: false
        },
        { //12
            id: 39,
            name: "GBPZAR",
            lot: 100000,
            leverage: 20,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: 1,
            pipToGBP: toGBP.ZAR,
            enabled: false
        },
        { //13
            id: 40,
            name: "USDBRL",
            lot: 100000,
            leverage: 20,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: toGBP.USD,
            pipToGBP: toGBP.BRL,
            enabled: false
        },
        { //14
            id: 41,
            name: "USDCZK",
            lot: 100000,
            leverage: 20,
            pip: 0.01,
            value: 0.1,
            marginToGBP: toGBP.USD,
            pipToGBP: toGBP.CZK,
            enabled: false
        },
        { //15
            id: 42,
            name: "USDHUF",
            lot: 100000,
            leverage: 20,
            pip: 0.01,
            value: 0.1,
            marginToGBP: toGBP.USD,
            pipToGBP: toGBP.HUF,
            enabled: false
        },
        { //16
            id: 43,
            name: "USDMXN",
            lot: 100000,
            leverage: 20,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: toGBP.USD,
            pipToGBP: toGBP.MXN,
            enabled: false
        },
        { //17
            id: 44,
            name: "USDPLN",
            lot: 100000,
            leverage: 20,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: toGBP.USD,
            pipToGBP: toGBP.PLN,
            enabled: false
        },
        {  //18
            id: 45,
            name: "USDRON",
            lot: 100000,
            leverage: 20,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: toGBP.USD,
            pipToGBP: toGBP.RON,
            enabled: false
        },
        { //19
            id: 46,
            name: "USDTRY",
            lot: 100000,
            leverage: 20,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: toGBP.USD,
            pipToGBP: toGBP.TRY,
            enabled: false
        },
        { //20
            id: 47,
            name: "USDZAR",
            lot: 100000,
            leverage: 20,
            pip: 0.0001,
            value: 0.1,
            marginToGBP: toGBP.USD,
            pipToGBP: toGBP.ZAR,
            enabled: false
        },
    ]
}