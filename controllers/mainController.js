const singleTradeController = require("./singleTradeController");     
const closeTradeController = require("./closeTradeController");  
const tradesController = require("./tradesController");  
const lockedAccountsController = require("./lockedAccountsController");  
const scheduleController = require("./scheduleController");  
const com = require("./commons");  
const errorsModel = require("../models/Errors");
const schEventsModel = require("../models/SchEvents");
const spreadsModel = require("../models/Spreads");
const dispatchModel = require("../models/Dispatch");
const lockedAccountsModel = require("../models/LockedAccounts");
const percentile = require("percentile");

const conf = require("../config/config");

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
    // dispatch cancel - true return true, nothing return false. Dont use false, it returns true(!) 
    app.post("/:accounts/:sl/:offset/:tp/:action/:symbol/:volume/:maxspread?/:dispcancel?/", async function(req, res) {
        var accounts = req.params.accounts;
        var sl = Number(req.params.sl);
        var tp = Number(req.params.tp);
        var offset = Number(req.params.offset);
        var action = req.params.action;
        var symbol = req.params.symbol;
        var volume = Number(req.params.volume);
        var maxSpread = Number(req.params.maxspread);
        var isDispatchCancel = Boolean(req.params.dispcancel);

        // action dynamic or preset
        if (action == "dynamic") action = req.body

        var accountsArr = accounts.split(',').map(Number)

        accountsArr.forEach( async account =>  {
            if (!isLockedAccount(account)) {
                await dispatchModel.dischargePreceding(dbClient, account, symbol)
                await dispatchModel.openDispatch(dbClient, account, action, symbol, 'pending', sl, offset, tp, volume, maxSpread, isDispatchCancel)
                .then(result =>
                    singleTradeController.trade(dbClient, account, sl, tp, offset, action, symbol, volume, maxSpread, isDispatchCancel, result.insertedId)
                )
            }
        }),

        res.status(200).send();
    });

    app.post("/close/:accounts/:symbol", async function(req, res) {
        var accounts = req.params.accounts;
        var symbol = req.params.symbol;

        var accountsArr = accounts.split(',').map(Number)

        accountsArr.forEach( async account =>  {
            if (!isLockedAccount(account)) {
                await dispatchModel.dischargePreceding(dbClient, account, symbol)
                await dispatchModel.openDispatch(dbClient, account, 'close', symbol, 'pending')
                closeTradeController.close(dbClient, account, symbol);
            }
        })
        res.status(200).send();
    });



    // SPREAD
    app.get("/spreads", function(req, res) {
        var symbols = conf.schedules.find(s => s.id == 1).symbols
        var output = ""
        symbols.forEach( symbol => {
            output = output + "<a target='_blank' href='http://" + req.headers.host + "/spread/" + symbol + "/1'>" + symbol + "</a><br>"
        })
        res.render("web", { output });
    });

    app.get("/spread/:symbol/:days", async function(req, res) {
        var symbol = req.params.symbol;
        var days = Number(req.params.days);
        const spreads = await spreadsModel.findSpreads(dbClient, symbol, days);
        const cur = conf.currencies.find( currency => currency.name == symbol )

        var spreadsArr = []
        var xyValues = []

        var links =
        "<a target='_blank' href='http://" + req.headers.host + "/spread/" + symbol + "/1'>1 day&nbsp</a>" +
        "<a target='_blank' href='http://" + req.headers.host + "/spread/" + symbol + "/3'>3 days&nbsp</a>" +
        "<a target='_blank' href='http://" + req.headers.host + "/spread/" + symbol + "/7'>7 days&nbsp</a>" +
        "<a target='_blank' href='http://" + req.headers.host + "/spread/" + symbol + "/28'>28 days</a>" 

        var body = []
        await spreads.forEach( s => {
            var spread = s.spread / cur.pip * com.getOnePipValueGbp(cur)
            var timeArr = s.time.split(":")
            var time = timeArr[0] + ":" + timeArr[1]

            spreadsArr.push(spread)
            xyValues.push( { x: time, y: spread.toFixed(2) } )
            body.push(time + " " + s.symbol + " " + spread.toFixed(2) + "£<br>")
        });

        var head = "<h4>" + symbol + "</h4>"
        head = head + "<table>"
        head = head + "<tr><th>One PIP in GBP</th><td>" + cur.pipToGBP.toFixed(2) + "£</td></tr>"
        head = head + "<tr><th>Leverage </th><td>" + cur.leverage + "</td></tr>"

        if (spreadsArr.length != 0) {
            head = head + "<tr><th>Spread Percentile 80</th><td>" + percentile(80, spreadsArr).toFixed(2) + "£</td></tr>"
            head = head + "<tr><th>Spread Max </th><td>" + spreadsArr.sort((a, b) => b - a)[0].toFixed(2) + "£</td></tr>"
            head = head + "<tr><th>Spread Min </th><td>" + spreadsArr.sort((a, b) => a - b)[0].toFixed(2) + "£</td></tr>"
            head = head + "</table>"
        }

        body.reverse()
        const output = head + body.join("")
        
        res.render("webChart", { output, xyValues, links });
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
    app.get("/", function(req, res) {
        var output = ""
        output += "<a target='_blank' href='http://" + req.headers.host + "/all-trades'>ALL TRADES</a><br>"
        output += "<a target='_blank' href='http://" + req.headers.host + "/trades'>TRADES BY ACCOUNT</a><br>"
        output += "<a target='_blank' href='http://" + req.headers.host + "/spreads'>SPREADS</a><br>"
        output += "<a target='_blank' href='http://" + req.headers.host + "/locked-accounts'>LOCKED ACCOUNTS</a><br>"
        output += "<a target='_blank' href='http://" + req.headers.host + "/schedules'>SCHEDULES</a><br>"
        output += "<a target='_blank' href='http://" + req.headers.host + "/exceptions'>ERRORS</a><br>"
        output += "<br>"
        output += "<p>/:account/:sl/:offset/:tp/:action/:symbol/:volume/:maxspread?/:cancel?<br>"
        output += "/close/:account/:symbol<br>"
        output += "/lock/:account/<br>"
        output += "/unlock/:account/</p>"
        output += "<p>curl -X POST http://" + req.headers.host + "/6/0/0/0/sell/GBPUSD/0.1<br>"
        output += "curl -X POST http://" + req.headers.host + "/6/0/0/0/sell/GBPUSD/0.1/2/true<br>"
        output += "curl -X POST http://" + req.headers.host + "/close/6/GBPUSD<br>"
        output += "curl -X POST http://" + req.headers.host + "/lock/6<br>"
        output += "curl -X POST http://" + req.headers.host + "/unlock/6</p>"
        res.render("web", { output });
    });

    async function renderTrades(data) {
        var output = "<table>"
        output += "<tr> <th></th> <th></th> <th>Acc</th> <th>Action</th> <th>Symbol</th> <th>SL</th>" +
        "<th>Offset</th> <th>TP</th> <th>Volume</th>  <th>Spread</th>  <th>Max</th> </tr>"

        var color = ""
        await data.forEach( d => {
            switch (d.status) {
                case "pending": 
                    color = "coral"
                break
                case "confirmed": 
                    color = "green"
                break
                case "discharged": 
                    color = "grey"
                break
                case "stopped": 
                    color = "brown"
                break
                default:
                    color = "black"
            }

            output += "<tr>" +
            "<td>" + d.time + "</td>" +
            "<td style='color:" + color + ";'>&nbsp" + d.status + "&nbsp</td>" +
            "<td>&nbsp" + d.account + "</td>" +
            "<td>&nbsp" + d.action + "</td>" +
            "<td>&nbsp" + d.symbol + "</td>" +
            "<td>&nbsp" + d.sl + "</td>" +
            "<td>&nbsp" + d.offset + "</td>" +
            "<td>&nbsp" + d.tp + "</td>" +
            "<td>&nbsp" + d.volume + "</td>" +
            "<td>&nbsp" + parseFloat(d.spread).toFixed(2) + "£</td>" +
            "<td>&nbsp" + parseFloat(d.maxSpread).toFixed(2) + "£</td>" +
            "</tr>"
        })
        return output += "</table>"
    }

    app.get("/trades", function(req, res) {
        var accounts = conf.login
        var output = "<h4>Accounts</h4>"
        accounts.forEach( account => {
            output = output + "<a target='_blank' href='http://" + req.headers.host + "/trades/" + account.id + "'>" + account.id + "</a><br>"
        })
        res.render("web", { output });
    });

    app.get("/trades/:account", async function (req, res) {
        var account = Number(req.params.account);
        const data = await dispatchModel.getDispatchesByAccount(dbClient, account)
        var output = await renderTrades(data)
        output += "<a href='http://" + req.headers.host + "/delete-trades/" + account + "'>clear</a>";
        res.render("web", { output });
    });

    app.get("/delete-trades/:account", async function(req, res) {  
        var account = Number(req.params.account);
        dispatchModel.deleteByAccount(dbClient, account);
        res.redirect("/trades/" + account);
    });

    app.get("/all-trades", async function (req, res) {
        var account = Number(req.params.account);
        const data = await dispatchModel.getAll(dbClient, account)
        var output = await renderTrades(data)
        res.render("web", { output });
    });

    app.get("/locked-accounts", async function(req, res) {
        var output = "<table>"
        await lockedAccountsModel.getAllLockedAccounts(dbClient).then(accounts => 
            accounts.forEach(account => {
                output += "<tr><td>" + account._id + "</td><td>" + account.isLocked + "</td></tr>"
            })
        )
        output += "</table>"
        res.render("web", { output });
    });

    app.get("/exceptions", async function(req, res) {  
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
        res.redirect("/exceptions");
    });

    app.get("/schedules", async function(req, res) {  
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
        res.redirect("/schedules");
    });

    // TRADES
    // http://localhost:3011/trades/open/3/0/0   ("open" can be replaced with anything)
    // http://localhost:3011/trades/history/3/1696125586000/0   ("account", "start", "end", last two - unix time stump + 000)
    app.get("/trades/:tradesType/:account/:start?/:end?", async function (req, res) {
        var tradesType = req.params.tradesType;
        var account = Number(req.params.account);
        var start = Number(req.params.start);
        var end = Number(req.params.end);

        await tradesController.getTrades(dbClient, tradesType, account, start, end).then(data => {
            res.json(data)
        }).catch(error => {
            console.error(error);
            res.json(error)
        });
    });
    
}}
