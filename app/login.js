var login = module.exports = {};

login.authenticate = function(username, password) {
    //var dbConnection = require('../dbConnection');
    var MongoClient = require('mongodb').MongoClient;
    console.log('Username: ', username);
    var query = { email: username };
    MongoClient.connect('mongodb://adityakotamraju:Health123@ds151752.mlab.com:51752/health_assistant').then((db) => {
        return db.collection("Users").find(query);
    }).catch((err) => {
        console.error('Mongo Connection failed: ', err);
        return null;
    });
};