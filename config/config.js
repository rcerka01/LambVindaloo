const secret = require("./secret");
const login = require("./login");
const schedules = require("./schedules");
const currencies = require("./currencies");

module.exports = {
    app: {
        protocol: "http",
        port: "3011"
    },
    ws: {
        url: "wss://ws.xapi.pro/demo"
    },
    wsLive: {
        url: "wss://ws.xtb.com/real"
    },
    db: {
        test: {
            uri: "mongodb+srv://vindaloo:" + secret.db.test.password + "@cluster0.k5ziu.mongodb.net/lambvindaloo?retryWrites=true&w=majority",
        },
        live: {
            uri: "",
            name: ""
        }
    },
    logs: {
        all: false,
        ws: false,
        spread: false,
        close: false,
        trade: false,
        verify: false,
        trades: false
    },
    defaultAccount: 1, // when account not passed with url
    login: login.accounts,
    schedules: schedules.tasks,
    currencies: currencies.mapper
}
