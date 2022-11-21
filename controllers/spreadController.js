const conf = require("../config/config");
const send = require("./wsSendRequests");  
const com = require("./commons");  
const errorsModel = require("../models/Errors");
const spreadsModel = require("../models/Spreads");

const localLog = conf.logs.spread

async function saveSpread(dbClient, symbol) {
    var account = conf.defaultAccount

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
                    send.getPrice(dbClient, symbol, wSocket) 

                } else if (response.returnData.ask != undefined) {
                        com.log(response.returnData, localLog)
                    spreadsModel.insertSpread(dbClient, symbol, response.returnData.spreadRaw)
                } else {
                        com.log("Disconecting, no action taken.", localLog);
                }

            } else {
                    com.log('Error: ' + response.errorDescr, localLog)
                errorsModel.saveError(dbClient, symbol, account, 'SpreadController, symbol:' + symbol + ', account:' + account  + ' ERROR:' + response.errorDescr, response);

            }
        } catch (Exception) {
                com.log('Fatal error while receiving data! :(', localLog);
            errorsModel.saveError(dbClient, symbol, account, 'SpreadController, Fatal error while receiving data! :(, symbol:' + symbol + ', account:' + account + ' ERROR:' + Exception.message);    
        }
    }

    wSocket.onclose = function() {
            com.log('Connection closed', localLog);
    };
}

module.exports = { 
    saveSpread
}
