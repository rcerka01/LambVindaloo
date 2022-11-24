const conf = require("../config/config");
const moment = require('moment');

// DB
async function insertDispatchDb(client, account, action, symbol, status, sl, offset, tp, volume, maxSpread) {
    const timestump = Date.now();
    const time = moment().format();
    const msg = {
        timestump,
        time,
        account,
        action,
        symbol,
        status,
        sl,
        offset,
        tp,
        volume,
        maxSpread
    }

    const result = await client.db(conf.db.name).collection("dispatches")
        .insertOne(msg);
    return result;
};

async function updateManyDB(client, filter, doc) {
    const results = client.db(conf.db.name).collection("dispatches")
        .updateMany(filter, doc);
    return results;     
};

async function updateOneDB(client, id, update) {
    const results = client.db(conf.db.name).collection("dispatches")
        .updateOne({ _id: id }, update, { upsert: true })
    return results;     
};

async function findDispatchesDb(client, query, projection) {
    const results = client.db(conf.db.name).collection("dispatches")
        .find(query, projection)
        .sort( { _id: -1 } );    
    return results;     
};

async function deleteDispatchesDb(client, query) {
    const results = client.db(conf.db.name).collection("dispatches")
        .deleteMany(query)
    return results;     
};

// Interface
async function openDispatch(client, account, action, symbol, status, sl, offset, tp, volume, maxSpread) {
    try {
        await insertDispatchDb(client, account, action, symbol, status, sl, offset, tp, volume, maxSpread);
    } catch (e) {
        console.error(e);
    }
}

async function dischargePreceding(dbClient, account, symbol) {
    const filter = { account: account, symbol: symbol, status: "pending" };
    const updateDoc = {
        $set: {
          status: "discharged"
        },
      };
    try {
        await  updateManyDB(dbClient, filter, updateDoc);
    } catch (e) {
        console.error(e);

    }
}

async function getPendings(client) {
    const query = { status: "pending" };
    const projection = {};

    try {
        const result = await findDispatchesDb(client, query, projection);
        return result;
    } catch (e) {
        console.error(e);
    }
}

async function verify(client, id) {
    var update = {$set: { status: 'confirmed' }}
    try {
        const result = await updateOneDB(client, id, update);
        return result;
    } catch (e) {
        console.error(e);
    }
}

async function getAll(client) {
    const query = {};
    const projection = {};

    try {
        const result = await findDispatchesDb(client, query, projection);
        return result;
    } catch (e) {
        console.error(e);
    }
}

async function getDispatchesByAccount(client, account) {
    const query = { account: account };
    const projection = {};

    try {
        const result = await findDispatchesDb(client, query, projection);
        return result;
    } catch (e) {
        console.error(e);
    }
}

async function deleteByAccount(client, account) {
    try {
        await  deleteDispatchesDb(client, { account: account });
    } catch (e) {
        console.error(e);
    }
}

module.exports = {
    openDispatch,
    dischargePreceding,
    getPendings,
    getAll,
    getDispatchesByAccount,
    verify,
    deleteByAccount
}
