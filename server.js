var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");

var MONGO_CONNECTION_URL = 'mongodb://adityakotamraju:Health123@ds151752.mlab.com:51752/health_assistant';
var COLLECTION = {
    "USERS": "Users",
    "REMINDERS": "Reminders"
};

var app = express();
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 5000));

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'ejs');

var db;
var alexa = require("./alexa/alexa_response");

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(MONGO_CONNECTION_URL, function(err, database) {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    db = database;
    console.log("Database connected to Health Assistant");
});

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({ "error": message });
}

/*  "/app/login"
 *    POST: Authenticates the user with the app
 */

app.get("/", function(req, res) {
    res.render("pages/sample.ejs");
});

/*  "/app/login"
 *    POST: Authenticates the user with the app
 */

app.post("/app/login", function(req, res) {
    db.collection(COLLECTION.USERS).find({
        $and: [
            { email: req.body.username },
            { password: req.body.password }
        ]
    }).toArray(function(err, docs) {
        if (err) {
            handleError(res, err.message, "Invalid username and password");
        } else {
            if (docs.length > 0) {
                res.status(200).json(docs);
            } else {
                handleError(res, "", "Invalid username and password");
            }
        }
    });
});

app.post("/app/schedule", function(req, res) {

    var newSchedule = req.body;

    if (!req.body.type) {
        handleError(res, "Invalid user input", "Must provide the type of reminder", 400);
    }

    db.collection(COLLECTION.REMINDERS).insertOne(newSchedule, function(err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to schedule a reminder.");
        } else {
            res.status(201).json(doc.ops[0]);
        }
    });

});

app.post("/alexa", function(req, res) {
    console.log('Received request from alexa..!');
    if (req.body.request.type === "LaunchIntent") {
        var resp = alexa.sayHello();
        res.status(200).json(resp);
    }
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});