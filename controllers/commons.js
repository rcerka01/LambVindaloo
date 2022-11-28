const conf = require("../config/config");
const WebSocket = require('ws');

const doLog = conf.logs.all

function log(txt, localFlag) {
    if (doLog || localFlag) console.log(txt)
}

function connect(account) {
    let login = conf.login.find(l => Number(l.id) === account);
    if (login.type === 'real') { var url = conf.wsLive.url; } else { var url = conf.ws.url; }
        log('Connecting to: ' + url)
    return new WebSocket(url);
}

function tradeDirectionToDigit(direction) {
    if (direction === "buy") {
        return 0;
    } else if (direction === "sell") {
        return 1;    
    } else {
        return -1;
    }
}

function getOnePipValueGbp(currency) {
    return currency.lot * currency.value * currency.pip * currency.pipToGBP
}

function pipToGbp(symbol, pipValue) {
    const cur = conf.currencies.find( currency => currency.name == symbol )
    var gbp = pipValue / cur.pip * getOnePipValueGbp(cur)
    return gbp
}

function getConfigBySymbol(symbol) { return conf.currencies.find(c => c.name == symbol) }

module.exports = {
    log,
    connect,
    tradeDirectionToDigit,
    getOnePipValueGbp,
    pipToGbp,
    getConfigBySymbol
}
