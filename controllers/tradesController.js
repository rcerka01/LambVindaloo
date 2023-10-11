const conf = require("../config/config");
const send = require("./wsSendRequests");  
const com = require("./commons");  

function formatError(e) { {error : e} }

const localLog = conf.logs.trades

async function getTrades(dbClient, tradesType, account, start, end) {
    return new Promise((resolve, reject) => {
        const wSocket = com.connect(account);

        wSocket.onopen = function() {
            com.log('Connected', localLog);
            send.login(dbClient, wSocket, account);
        };

        wSocket.onmessage = function(evt) {
            try {
                var response = JSON.parse(evt.data);
                if(response.status == true) {
                    if(response.streamSessionId != undefined) {

                        if (tradesType == "history")
                            { send.getTradesHistory(dbClient, start, end, wSocket) }
                        else
                            { send.getTrades(dbClient, wSocket) }
                        com.log("Login successful", localLog);

                    } else if (response.returnData != undefined) {
                        com.log(JSON.stringify(response.returnData), localLog)
                        resolve(response.returnData); // Resolve the promise with data
                    } else {
                        com.log("Disconnecting, no action taken.", localLog);
                    }
                } else {
                    com.log('Error: ' + response.errorDescr, localLog)
                    reject(formatError(response.errorDescr)); // Reject the promise with an error
                }
            } catch (Exception) {
                com.log('Fatal error while receiving data! :(', localLog);
                reject(formatError(Exception.message)); // Reject the promise with an error
            }
        }

        wSocket.onclose = function() {
            com.log('Connection closed', localLog);
        };
    });
}

module.exports = { 
    getTrades
}
