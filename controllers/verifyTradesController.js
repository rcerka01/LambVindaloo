const singleTradeController = require("./singleTradeController");     
const closeTradeController = require("./closeTradeController"); 
const conf = require("../config/config");
const send = require("./wsSendRequests");  
const dispatchModel = require("../models/Dispatch");
const errorsModel = require("../models/Errors");
const com = require("./commons");  

const localLog = conf.logs.verify

module.exports = { verify: function (dbClient, account, symbol, cmd, id, sl, offset, tp, volume, maxSpread) {
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
                } else {

                    //
                    const fromXtb = response.returnData.filter(item => item.symbol == symbol)
                    if ((fromXtb.length == 1 && fromXtb[0].cmd == cmd) || (fromXtb.length == 0 && cmd == -1)) {
                        dispatchModel.verify(dbClient, id)
                            com.log("Trade confirmed", localLog)
                    } else if (cmd == -1) {
                        closeTradeController.close(dbClient, account, symbol);
                            com.log("Trade closed during verification", localLog)
                    } else if (cmd == 0) {
                        singleTradeController.trade(dbClient, account, sl, tp, offset, "buy", symbol, volume, maxSpread);
                            com.log("Switch to Buy during verification", localLog)
                    } else if (cmd == 1) {
                        singleTradeController.trade(dbClient, account, sl, tp, offset, "sell", symbol, volume, maxSpread);
                            com.log("Switch to Sell during verification", localLog)
                    }
                    //

                }
            } else {
                    com.log('Error: ' + response.errorDescr, localLog);
                errorsModel.saveError(dbClient, symbol, account, 'OpenTradesController, symbol:' + symbol + ' account:' + account + ', error description:' + response.errorDescr, response);

            }
        } catch (Exception) {
                com.log('Fatal error while receiving data! :(', localLog);
            errorsModel.saveError(dbClient, symbol, account, 'OpenTradesController, Fatal error while receiving data! :(, simbol:' + symbol + " account:" + account  + ', ERROR:' + Exception.message);    
        }
    }

    wSocket.onclose = function() {
            com.log('Connection closed', localLog);
    };

}}
