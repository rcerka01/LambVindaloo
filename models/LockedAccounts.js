const conf = require("../config/config");
const { accounts } = require("../config/login");

async function updateListing(client, id, value) {
    const result = await client.db(conf.db.name).collection("lockedAccounts")
        .updateOne(id, { $set: value });
};

async function insertListing(client, account) {
    const result = await client.db(conf.db.name).collection("lockedAccounts")
        .insertOne(account);
};

async function deleteListing(client, id) {
    const result = await client.db(conf.db.name).collection("lockedAccounts")
        .deleteOne(id);
};

async function findListings(client, query, projection) {
    const results = client.db(conf.db.name).collection("lockedAccounts")
        .find(query, projection)
        .sort( { _id: -1 } );           
    return results;     
};

async function insertAccount(client, account) {
    try {
        await  insertListing(client, account);
    } catch (e) {
        console.error(e);
    }
}

async function getAllLockedAccounts(client) {
    const query = {};
    const projection = {};
    try {
        const result = await findListings(client, query, projection);
        return result;
    } catch (e) {
        console.error(e);
    }
}

async function deleteAccount(client, id) {
    const query = { _id: id };
    try {
        const result = await deleteListing(client, query);
        return result;
    } catch (e) {
        console.error(e);
    }
}

async function updateAccount(client, id, value) {
    try {
        const result = await updateListing(client, { _id: id }, value);
        return result;
    } catch (e) {
        console.error(e);
    }
}

module.exports = {
    getAllLockedAccounts: getAllLockedAccounts,
    insertAccount: insertAccount,
    deleteAccount: deleteAccount,
    updateAccount: updateAccount
}
