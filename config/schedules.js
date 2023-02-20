const symbols = [
"USDCHF", "USDJPY", "USDCAD", "USDZAR", 
"USDSEK", "USDPLN", "USDNOK", "USDHUF", 
"EURUSD", "EURCHF", "EURGBP", "EURJPY", 
"EURCAD", "EURNOK", "EURZAR", "EURTRY",
"GBPUSD", "GBPCHF", "GBPJPY", "GBPCAD",
"CHFJPY", "NZDJPY", "CADCHF", "AUDUSD",
"NATGAS",
"OIL.WTI"
]

module.exports = {
    // 999 fictional account to run scheduler once
    // ONCE fictional symbol to run scheduler once
    //
    // dayW - 0 or 7 Sun
    //       (sec min hour dayM month dayW)
    // cron: "0    10   00    *     *    3",
    tasks: [
        // Collect Spreads
        {
            id: 1,
            name: "Collect spread statistics from Monday till Thursday",
            cron: "10 * * * * 1-4",
            actions: ["saveSpread"],
            symbols: symbols, 
            accounts: [999]
        },
        {
            id: 2,
            name: "Collect spread statistics on Friday",
            cron: "10 * 0-22 * * 5",
            actions: ["saveSpread"],
            symbols: symbols, 
            accounts: [999]
        },
        {
            id: 3,
            name: "Collect spread statistics on Sunday",
            cron: "10 * 21-23 * * 7",
            actions: ["saveSpread"],
            symbols: symbols, 
            accounts: [999]
        },
        // Delete Spreads
        {
            id: 4,
            name: "Delete spreads older than 28 days daily (five past one in night)",
            cron: "* 5 1 * * *",
            actions: ["deleteOldSpreads"],
            symbols: symbols, 
            accounts: [999]
        },
        // Confirm Trades
        {
            id: 5,
            name: "Retray pending dispatches from Monday till Thursday",
            cron: "*/15 * * * * 1-4",
            actions: ["retryPending"],
            symbols: ["ONCE"], 
            accounts: [999]
        },
        {
            id: 6,
            name: "Retray pending dispatches on Friday",
            cron: "*/15 * 0-21 * * 5",
            actions: ["retryPending"],
            symbols: ["ONCE"], 
            accounts: [999]
        },
        {
            id: 7,
            name: "Retray pending dispatches on Sunday",
            cron: "*/15 * 22-23 * * 7",
            actions: ["retryPending"],
            symbols: ["ONCE"], 
            accounts: [999]
        }
    ]
}
