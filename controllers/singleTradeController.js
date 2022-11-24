const conf = require("../config/config");
const send = require("./wsSendRequests");  
const errorsModel = require("../models/Errors");
const com = require("./commons");  
const WebSocket = require('ws');

const localLog = conf.logs.trade

function actionStringToInt(action) {
    if (action == "buy") { return 0; } else { return 1; }
}

function closeOpositeTrades(dbClient, trades, symbol, wSocket, action) {
    var cmd = actionStringToInt(action);
    for (i in trades) {
        // close only trades of oposite direction
        if (trades[i].symbol == symbol && trades[i].cmd != cmd) {
            send.closeTrade(dbClient, trades[i].position, trades[i].volume, trades[i].close_price, symbol, wSocket);
        }
    }
}

function isExistingTrade(trades, symbol, cmd) {
    return trades.some(item =>  item.cmd === cmd && item.symbol === symbol )
}

module.exports = { trade: function (dbClient, account, sl, tp, offset, action, symbol, volume) {
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

                } else if (response.returnData.ask != undefined) {
                    /* return getPrice */
                    if (action == "sell") { var price = response.returnData.bid; } else { var price = response.returnData.ask; }
                    send.startTrade(dbClient, action, symbol, price, volume, wSocket, sl, tp, offset)
            
                } else if (response.returnData.order != undefined) {
                    /* return startTrade. Jusr order ID */
                    var order = response.returnData.order;
                        com.log("Order compleated: " + order, localLog); // finish

                    // change condition to for also 0 trades open
                } else if (response.returnData.length > 0) {
                    
                    // close oposite trades to current action if exist
                    closeOpositeTrades(dbClient, response.returnData, symbol, wSocket, action);

                    /* return getPreviousTrades */
                    var cmd = actionStringToInt(action);

                    // only if trade is NOT in same direction (buy / sell)
                    if (!isExistingTrade(response.returnData, symbol, cmd)) {

                        send.getPrice(dbClient, symbol, wSocket) // ignites new order
                    }

                } else if (response.returnData.length == 0) {
                    /* return getPreviousTrades, none exist. Start first one */

                    send.getPrice(dbClient, symbol, wSocket)

                } else {
                        com.log("Disconecting, no action taken.", localLog);
                }
            } else {
                    com.log('Error: ' + response.errorDescr, localLog);
                errorsModel.saveError(dbClient, symbol, account, 'SingleTradeController, sl:' + sl + " tp:" + tp + " offset:" + offset + " action:" + action + " symbol:" + symbol + " volume:" + volume  + ', error description:' + response.errorDescr, response);

            }
        } catch (Exception) {
                com.log('Fatal error while receiving data! :(', localLog);
            errorsModel.saveError(dbClient, symbol, account, 'SingleTradeController, Fatal error while receiving data! :(, sl:'  + sl + " tp:" + tp + " offset:" + offset + " action:" + action + " symbol:" + symbol + " volume:" + volume  + ' ERROR:' + Exception.message);    
        }
    }

    wSocket.onclose = function() {
            com.log('Connection closed', localLog);
    };

}}
