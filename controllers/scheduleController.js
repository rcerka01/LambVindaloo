const conf = require("../config/config");
const schedule = require('node-schedule');
const lockedAccountsController = require("./lockedAccountsController");
const spreadController = require("./spreadController");  
const verifyTradesController = require("./verifyTradesController");  
const com = require("./commons");  
const schEventsModel = require("../models/SchEvents");
const dispatchModel = require("../models/Dispatch");

async function retryPendings(dbClient) {
    const pendings = await dispatchModel.getPendings(dbClient)
    pendings.forEach( p => {
        const cmd = com.tradeDirectionToDigit(p.action);
        verifyTradesController.verify(dbClient, p.account, p.symbol, cmd, p._id, p.sl, p.offset, p.tp, p.volume, p.maxSpread)                  
    })   
}

async function stringToComand(dbClient, str, account, symbol) {
    switch (str) {
        case "saveSpread":
            await spreadController.saveSpread(dbClient, symbol)
        break

        case "retryPending":
            await retryPendings(dbClient)
        break

        case "addToLockedAccounts":
            await lockedAccountsController.lock(dbClient, account);
            await schEventsModel.insertEvent(dbClient, str, account, symbol);
        break

        case "removeFromLockedAccounts":
            await lockedAccountsController.unlock(dbClient, account);
            await schEventsModel.insertEvent(dbClient, str, account, symbol);
        break
    }
}

function run(dbClient) {
    conf.schedules.forEach(sch => {
        sch.accounts.forEach( acc => {
            sch.symbols.forEach( symb => {
                sch.actions.forEach( act => {
                    schedule.scheduleJob(sch.cron, function() {
                        stringToComand(dbClient, act, acc, symb)
                    });
                });
            });
        });
    });
}

module.exports = { 
    run
}