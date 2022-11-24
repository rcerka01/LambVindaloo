const symbols = [
"USDCHF", "USDJPY", "USDCAD", "USDZAR", 
"USDSEK", "USDPLN", "USDNOK", "USDHUF", 
"EURUSD", "EURCHF", "EURGBP", "EURJPY", 
"EURCAD", "EURNOK", "EURZAR", "EURTRY",
"GBPUSD", "GBPCHF", "GBPJPY", "GBPCAD",
"CHFJPY", "NZDJPY", "CADCHF", "AUDUSD"
]

module.exports = {
    // 999 fictional account to run scheduler once
    // ONCE fictional symbol to run scheduler once
    //
    // dayW - 0 Sun
    //       (sec min hour dayM month dayW)
    // cron: "0    10   00    *     *    3",
    tasks: [
        {
            id: 1,
            name: "Spread statistics",
            cron: "10 * * * * *",
            actions: ["saveSpread"],
            symbols: symbols, 
            accounts: [999]
        },
        {
            id: 2,
            name: "Retray pending dispatches",
            cron: "*/15 * * * * *",
            actions: ["retryPending"],
            symbols: ["ONCE"], 
            accounts: [999]
        },
    ]
}