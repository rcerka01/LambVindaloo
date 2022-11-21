const conf = require("../config/config");
const moment = require('moment');

async function insertListing(client, symbol, account, description, response) {
    const timestump = Date.now();
    const time = moment().format();
    const msg = {
        timestump,
        time,
        symbol,
        account,
        description,
        response
    }

    const result = await client.db(conf.db.name).collection("Errors").insertOne(msg);
};

async function findListings(client, query, projection) {
    const results = client.db(conf.db.name).collection("Errors")
        .find(query, projection)
        .sort( { _id: -1 } );    
    return results;     
};

async function deleteListings(client, query) {
    const results = client.db(conf.db.name).collection("Errors")
        .deleteMany(query)
    return results;     
};

async function insertError(client, strategyId, symbol, account, description, response) {
    try {
        await  insertListing(client, strategyId, symbol, account, description, response);
    } catch (e) {
        console.error(e);
    }
}

async function find(client) {
    const query = {};
    const projection = {};

    try {
        const result = await findListings(client, query, projection);
        return result;
    } catch (e) {
        console.error(e);
    }
}

async function deleteAll(client) {
    try {
        await  deleteListings(client, {});
    } catch (e) {
        console.error(e);
    }
}

module.exports = {
    saveError: insertError,
    find: find,
    deleteAll: deleteAll
}
