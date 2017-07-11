var db = module.exports = {};

db.getConnection = function() {
    //Establishing connection to mongo db
    var MongoClient = require('mongodb').MongoClient;
    return MongoClient.connect('mongodb://adityakotamraju:Health123@ds151752.mlab.com:51752/health_assistant');
};