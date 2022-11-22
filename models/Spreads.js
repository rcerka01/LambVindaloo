const conf = require("../config/config");
const moment = require('moment');

async function insertSpreadDb(client, symbol, spread) {
    const timestump = Date.now();
    const time = moment().format();
    const msg = {
        timestump,
        time,
        symbol,
        spread
    }

    const result = await client.db(conf.db.name).collection("spreads")
        .insertOne(msg);
};

async function findSpreadsDb(client, query, projection) {
    const results = client.db(conf.db.name).collection("spreads")
        .find(query, projection)
        .sort( { _id: 1 } );    
    return results;     
};

async function deleteSpreadsDb(client, query) {
    const results = client.db(conf.db.name).collection("spreads")
        .deleteMany(query)
    return results;     
};

async function insertSpread(client, symbol, spread) {
    try {
        await  insertSpreadDb(client, symbol, spread);
    } catch (e) {
        console.error(e);
    }
}

async function findSpreads(client, symbol) {
    const query = { symbol: symbol };
    const projection = {};

    try {
        const result = await findSpreadsDb(client, query, projection);
        return result;
    } catch (e) {
        console.error(e);
    }
}

async function deleteAllSpreads(client) {
    try {
        await  deleteSpreadsDb(client, {});
    } catch (e) {
        console.error(e);
    }
}

module.exports = {
    insertSpread,
    findSpreads,
    deleteAllSpreads
}
