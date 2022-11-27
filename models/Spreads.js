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

async function findSpreads(client, symbol, days) {
    var ObjectId = require('mongodb').ObjectID;
    const query = { 
        symbol:symbol,
        _id: {
            $gt: ObjectId(Math.floor((new Date(new Date() - days * 60 * 60 * 24 * 1000))/1000).toString(16) + "0000000000000000"), 
          }
    };

    const projection = {}

    try {
        const result = await findSpreadsDb(client, query, projection);
        return result;
    } catch (e) {
        console.error(e);
    }
}

async function deleteOldSpreads(client) {
    var ObjectId = require('mongodb').ObjectID;

    const query = { 
        _id: {
            $lt: ObjectId(Math.floor((new Date(new Date() - 28 * 60 * 60 * 24 * 1000))/1000).toString(16) + "0000000000000000"), 
          }
    };

    try {
        await  deleteSpreadsDb(client, query);
    } catch (e) {
        console.error(e);
    }
}

module.exports = {
    insertSpread,
    findSpreads,
    deleteOldSpreads
}
