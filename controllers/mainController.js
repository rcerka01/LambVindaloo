const singleTradeController = require("./singleTradeController");     
const closeTradeController = require("./closeTradeController");  
const spreadController = require("./spreadController");  
const scheduleController = require("./scheduleController");     
const lockedAccountsController = require("./lockedAccountsController");  
const errorsModel = require("../models/Errors");
const schEventsModel = require("../models/SchEvents");

module.exports = { run: async function (app, dbClient) {

    // set locked accounts
    await lockedAccountsController.synchronizeDbToConfig(dbClient);
    await lockedAccountsController.setLockedAccounts(dbClient);

    // start scheduler
    scheduleController.run(dbClient);

    function isLockedAccount(account) {
        return lockedAccountsController.isLockedAccount(account);
    }

    function formatTime(time) {
        return time.replace("T", " ").substring(0, time.length - 6);
    }

    function hasResponse(doc, value) {
        if (doc.hasOwnProperty('response') && doc.response !== null) { return doc.response[value]; }
        return '';
    }

    function strong(value) {
        return "<strong>" + value + "</strong>";
    }



    // ACTIONS
    app.post("/:account/:sl/:offset/:tp/:action/:symbol/:volume", function(req, res) {

        var account = Number(req.params.account);
        var sl = Number(req.params.sl);
        var tp = Number(req.params.tp);
        var offset = Number(req.params.offset);
        var action = req.params.action;
        var symbol = req.params.symbol;
        var volume = Number(req.params.volume);

        if (!isLockedAccount(account)) {
            singleTradeController.trade(dbClient, account, sl, tp, offset, action, symbol, volume);
        }

        res.status(200).send();
    });

    app.post("/close/:account/:symbol", function(req, res) {
        var account = Number(req.params.account);
        var name = req.params.symbol;
        if (!isLockedAccount(account)) {
            closeTradeController.close(dbClient, account, name);
        }
        res.status(200).send();
    });


    

    // LOCK
    app.post("/lock/:account/", function(req, res) {
        var account = Number(req.params.account);
        lockedAccountsController.lock(dbClient, account);
        res.status(200).send();
    });

    app.post("/unlock/:account/", function(req, res) {
        var account = Number(req.params.account);
        lockedAccountsController.unlock(dbClient, account);
        res.status(200).send();
    });



  
    // LOGS
    app.get("/display-exceptions", async function(req, res) {  
        const results = await errorsModel.find(dbClient);

        const outputClearLink = "<a href='http://" + req.headers.host 
        + "/delete-errors'>clear</a>";

        let output = outputClearLink + "<br>";
        let count = 1;
        await results.forEach(doc => {
            output += 
            strong(count++) 
            + " " + formatTime(doc.time) 
            + " " + strong(doc.strategyId)
            + " " + doc.account
            + " " + strong(doc. symbol)
            + " " + doc.description
            + " " + "status: " + strong(hasResponse(doc, 'status'))
            + " " + hasResponse(doc, 'errorCode')
            + " " + strong(hasResponse(doc, 'errorDescr'))
            + "<br>"
        });

        res.render("web", { output });
    });

    app.get("/delete-errors", async function(req, res) {  

        errorsModel.deleteAll(dbClient);

        res.redirect("/display-exceptions");
    });

    app.get("/display-schedules", async function(req, res) {  
        const results = await schEventsModel.find(dbClient);

        const outputClearLink = "<a href='http://" + req.headers.host 
        + "/delete-schedules'>clear</a>";

        let output = outputClearLink + "<br>";
        let count = 1;
        await results.forEach(doc => {
            output += 
            strong(count++) 
            + " " + formatTime(doc.time) 
            + " " + strong(doc.comand)
            + " " + doc.account
            + " " + strong(doc. symbol)
            + "<br>"
        });

        res.render("web", { output });
    });

    app.get("/delete-schedules", async function(req, res) {  

        schEventsModel.deleteAll(dbClient);

        res.redirect("/display-schedules");
    });

}}
