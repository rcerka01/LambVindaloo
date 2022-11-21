const conf = require("./config/config");
const MongoClient = require('mongodb').MongoClient;

const express = require('express');
const app = express();

const dbUri = conf.db.test.uri;
const dbClient = new MongoClient(dbUri, { useUnifiedTopology: true } );

app.set("view engine", "ejs");
app.use("/assets", express.static(__dirname + "/public"));

const mainController = require('./controllers/mainController');

try {
    dbClient.connect(function (err, mongodbClient) {
        if (err) { console.log(err); }
        mainController.run(app, mongodbClient);
    });
} catch (e) {
    console.error(e);
}

app.listen(conf.app.port);
