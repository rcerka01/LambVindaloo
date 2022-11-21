const conf = require("../config/config");
const send = require("./wsSendRequests");
const errorsModel = require("../models/Errors");
const com = require("./commons");  
const WebSocket = require('ws');

const localLog = conf.logs.close

function closeTrades(dbClient, trades, symbol, wSocket) {
    for (i in trades) {
        if (trades[i].symbol === symbol) {
            send.closeTrade(dbClient, trades[i].position, trades[i].volume, trades[i].close_price, symbol, wSocket);
        }
    }
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

module.exports = { close: function (dbClient, account, symbol, tradeDirection) {
    const cmd = tradeDirectionToDigit(tradeDirection);

    const wSocket = com.connect(account);

    wSocket.onopen = function() {
            com.log('Connected', localLog);
        ws = send.login(dbClient, wSocket, account);
    };

    wSocket.onmessage = function(evt) {
        try {
            var response = JSON.parse(evt.data);
            if(response.status == true) {
                if(response.streamSessionId != undefined) {
                        com.log("Login successful", localLog);
                    send.getPreviousTrades(dbClient, wSocket);

                } else if (response.returnData.length > 0) {
                    
                    if (cmd < 0) {
                        closeTrades(dbClient, response.returnData, symbol, wSocket);
                    } else {
                        const tradesToClose =  response.returnData.filter(data => 
                            data.symbol === symbol && data.cmd === cmd);
                        closeTrades(dbClient, tradesToClose, symbol, wSocket);
                    }                    

                } else {
                        com.log("Disconecting, no action taken.", localLog);
                }
            } else {
                    com.log('Error: ' + response.errorDescr, localLog);
                errorsModel.saveError(dbClient, symbol, account, 'CloseTradeController, ' + response.errorDescr, response);
            }
        } catch (Exception) {
                com.log('Fatal error while receiving data! :(', localLog);
            errorsModel.saveError(dbClient, symbol, account, 'CloseTradeController, Fatal error while receiving data! :(, Error:' + Exception.message);
        }
    }

    wSocket.onclose = function() {
            com.log('Connection closed', localLog);
    };

}}
