const conf = require("../config/config");
const moment = require('moment');

async function insertListing(client, comand, symbol, account) {
    const timestump = Date.now();
    const time = moment().format();
    const msg = {
        timestump,
        time,
        comand,
        symbol,
        account
    }

    const result = await client.db(conf.db.name).collection("schEvents")
        .insertOne(msg);
};

async function findListings(client, query, projection) {
    const results = client.db(conf.db.name).collection("schEvents")
        .find(query, projection)
        .sort( { _id: -1 } );    
    return results;     
};

async function deleteListings(client, query) {
    const results = client.db(conf.db.name).collection("schEvents")
        .deleteMany(query)
    return results;     
};

async function insertTask(client, comand, symbol, account) {
    try {
        await  insertListing(client, comand, symbol, account);
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
    insertEvent: insertTask,
    find: find,
    deleteAll: deleteAll
}
