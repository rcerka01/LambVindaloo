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

module.exports = {
    log,
    connect
}
