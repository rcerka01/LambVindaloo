const conf = require("../config/config");
const errorsModel = require("../models/Errors");
const com = require("./commons");  

const localLog = conf.logs.ws

function sendLogin(dbClient, ws, account) {
    var msg = {};
    msg.command = "login";
    var arguments = {};
    
    let login = conf.login.find(l => Number(l.id) === account);
    arguments.userId = login.user;
    arguments.password = login.password;
    msg.arguments = arguments;
        com.log('Trying to log in as: ' + msg.arguments.userId, localLog);
    try {
        var msg = JSON.stringify(msg);
        ws.send(msg);
            com.log('Sent ' + msg.length + ' bytes of data: ' + msg, localLog);
    } catch(Exception) {
            com.log('Error while sending data: ' + Exception.message, localLog);
        errorsModel.saveError(dbClient, "login", account, 'WS, sendLogin(), MESSAGE:' + JSON.stringify(msg)  + ' ERROR:' + Exception.message);
    }
}

function getPrice(dbClient, symbol, ws) {
    var msg = {};
    msg.command = "getSymbol";
    var arguments = {};
    arguments.symbol = symbol;
    msg.arguments = arguments;
    try {
        var msg = JSON.stringify(msg);
        ws.send(msg);
            com.log('Sent ' + msg.length + ' bytes of data: ' + msg, localLog);
    } catch(Exception) {
            com.log('Error while sending data: ' + Exception.message, localLog);
        errorsModel.saveError(dbClient, symbol, 0, 'WS, sendGetPrice(), MESSAGE:' + JSON.stringify(msg)  + ' ERROR:' + Exception.message);
    }
}

function sendStartTrade(dbClient, action, symbol, price, volume, wSocket, sl, tp, offset) {
    const nrFormated = (nr) => { return Number(nr.toFixed(5)); }
    offset = offset * 10;
    const pipFactor = com.getConfigBySymbol(symbol).pip
    if (action == "sell") { 
        var cmd = 1; 
        if (sl != 0) { sl = (price + sl * pipFactor); }
        if (tp != 0) { tp = (price - tp * pipFactor); }
        sl = nrFormated(sl);
        tp = nrFormated(tp);
    } else { 
        var cmd = 0;
        if (sl != 0) { sl = (price - sl * pipFactor); }
        if (tp != 0) { tp = (price + tp * pipFactor); }
        sl = nrFormated(sl);
        tp = nrFormated(tp);
    }
    var msg = {};
    msg.command = "tradeTransaction";
    var arguments = {};
    var tradeTransInfo = {};
    tradeTransInfo.cmd = cmd;
    tradeTransInfo.price = price;
    tradeTransInfo.symbol = symbol;
    tradeTransInfo.type = 0;
    tradeTransInfo.volume = volume;
    tradeTransInfo.sl = sl;
    tradeTransInfo.tp = tp;
    tradeTransInfo.offset = offset;
    arguments.tradeTransInfo = tradeTransInfo;
    msg.arguments = arguments;
    try {
        var msg = JSON.stringify(msg);
        wSocket.send(msg);
            com.log('Sent ' + msg.length + ' bytes of data: ' + msg, localLog);
    } catch(Exception) {
            com.log('Error while sending data: ' + Exception.message, localLog);
        errorsModel.saveError(dbClient, symbol, 0, 'WS, sendStartTrade(), MESSAGE:' + JSON.stringify(msg)  + ' ERROR:' + Exception.message);
    }
}

function sendCloseTrade(dbClient, position, volume, price, symbol, wSocket) {
    var msg = {};
    msg.command = "tradeTransaction";
    var arguments = {};
    var tradeTransInfo = {};
    tradeTransInfo.cmd = 0;
    tradeTransInfo.order = position;
    tradeTransInfo.volume = volume;
    tradeTransInfo.price = price;
    tradeTransInfo.symbol = symbol;
    tradeTransInfo.type = 2;
    arguments.tradeTransInfo = tradeTransInfo;
    msg.arguments = arguments;
    try {
        var msg = JSON.stringify(msg);
        wSocket.send(msg);
            com.log('Sent ' + msg.length + ' bytes of data: ' + msg, localLog);
    } catch(Exception) {
            com.log('Error while sending data: ' + Exception.message, localLog);
        errorsModel.saveError(dbClient, symbol, 0, 'WS, sendCloseTrade(), MESSAGE:' + JSON.stringify(msg)  + ' ERROR:' + Exception.message);
    }
}

function sendGetPreviousTrades(dbClient, wSocket) {
   var msg = {};
   msg.command = "getTrades";
   var arguments = {};
   arguments.openedOnly = true;
   msg.arguments = arguments;
   try {
       var msg = JSON.stringify(msg);
       wSocket.send(msg);
            com.log('Sent ' + msg.length + ' bytes of data: ' + msg, localLog);
    } catch(Exception) {
            com.log('Error while sending data: ' + Exception.message, localLog);
       errorsModel.saveError(dbClient, "", 0, 'WS, sendGetPreviousTrades(), MESSAGE:' + JSON.stringify(msg)  + ' ERROR:' + Exception.messages);
    }
}

function getTrades(dbClient, ws) {
    var msg = {};
    msg.command = "getTrades";
    var arguments = {};
    arguments.openedOnly = true;
    msg.arguments = arguments;
    try {
        var msg = JSON.stringify(msg);
        ws.send(msg);
            com.log('Sent ' + msg.length + ' bytes of data: ' + msg, localLog);
    } catch(Exception) {
            com.log('Error while sending data: ' + Exception.message, localLog);
        errorsModel.saveError(dbClient, symbol, 0, 'WS, sgetTrades(), MESSAGE:' + JSON.stringify(msg)  + ' ERROR:' + Exception.message);
    }
}

function getTradesHistory(dbClient, start, end, ws) {
    var msg = {};
    msg.command = "getTradesHistory";
    var arguments = {};
    arguments.end = end;
    arguments.start = start;
    msg.arguments = arguments;
    try {
        var msg = JSON.stringify(msg);
        ws.send(msg);
            com.log('Sent ' + msg.length + ' bytes of data: ' + msg, localLog);
    } catch(Exception) {
            com.log('Error while sending data: ' + Exception.message, localLog);
        errorsModel.saveError(dbClient, symbol, 0, 'WS, sgetTradesHistory(), MESSAGE:' + JSON.stringify(msg)  + ' ERROR:' + Exception.message);
    }
}

module.exports = {
    login: function login(dbClient, ws, account) { sendLogin(dbClient, ws, account); },
    getPrice,
    startTrade: function startTrade(dbClient, action, symbol, price, volume, wSocket, sl, tp, offset) { sendStartTrade(dbClient, action, symbol, price, volume, wSocket, sl, tp, offset); },
    closeTrade: function closeTrade(dbClient, position, volume, price, symbol, wSocket) { sendCloseTrade(dbClient, position, volume, price, symbol, wSocket); },
    getPreviousTrades: function getPreviousTrades(dbClient, wSocket) { sendGetPreviousTrades(dbClient, wSocket); },
    getTrades,
    getTradesHistory
}
