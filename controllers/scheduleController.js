const conf = require("../config/config");
const schedule = require('node-schedule');
const lockedAccountsController = require("./lockedAccountsController");
const spreadController = require("./spreadController");  
const schEventsModel = require("../models/SchEvents");

async function stringToComand(dbClient, str, account, symbol) {
    switch (str) {
        case "saveSpread":
            await spreadController.saveSpread(dbClient, symbol)
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
    run: run
}