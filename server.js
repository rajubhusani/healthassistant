var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");

var MONGO_CONNECTION_URL = 'mongodb://adityakotamraju:Health123@ds151752.mlab.com:51752/health_assistant';
var COLLECTION = {
    "USERS": "Users",
};

var app = express();
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 5002));

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

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
    res.status(code || 200).json({
        "error": message
    });
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
        $and: [{
                email: req.body.username
            },
            {
                password: req.body.password
            }
        ]
    }).toArray(function(err, docs) {
        if (err) {
            handleError(res, err.message, "Invalid username and password");
        } else {
            if (docs.length > 0) {
                delete docs[0].password;
                res.status(200).json(docs);
            } else {
                handleError(res, "Username password match not found", "Invalid username and password");
            }
        }
    });
});

/*  "/app/scheduleTask"
 *    POST: Schedules tasks for each user
 */

app.post("/app/scheduleTask", function(req, res) {

    var newTask = req.body;
    var moment = require("moment");
    var taskDate = moment(newTask.dateTime, "x").format("DD MMM YYYY hh:mm a");
    console.log('Task Received: ', newTask);
    db.collection(COLLECTION.USERS).findOneAndUpdate({
        "_id": newTask._id
    }, {
        $addToSet: {
            "tasks": {
                "tasktype": newTask.taskType,
                "taskDesc": newTask.taskDesc,
                "date": taskDate
            }
        }
    }).then((resp) => {
        console.log('Task Successfully inserted');
        res.status(200).json({
            "success": "Task scheduled successfully"
        });
    }, (er) => {
        handleError(res, er.message, "Schduling task failed, please try again after sometime");
    });
});

app.post("/app/LogHealthData", function(req, res) {

    var newTask = req.body;
    var moment = require("moment");
    var type = newTask.type;
    var taskDate = moment(newTask.dateTime, "x").format("YYYY-MM-DD");
    console.log('Task Received: ', newTask);
    db.collection(COLLECTION.USERS).findOneAndUpdate({
        "_id": newTask._id
    }, {
        $addToSet: {
            "healthdata": {
                "value": newTask.value,
                "type": type,
                "date": taskDate
            }
        }
    }).then((resp) => {
        console.log('Data Successfully inserted');
        res.status(200).json({
            "success": "Data scheduled successfully"
        });
    }, (er) => {
        handleError(res, er.message, "Data insert failed, please try again after sometime");
    });
});

app.post("/alexa", function(req, res) {
    console.log('Received request from alexa..!');
    if (req.body.request.type === "LaunchRequest") {
        var resp = alexa.sayHello('Aditya');
        res.status(200).json(resp);
    } else if (req.body.request.type === "IntentRequest") {
        var intentName = req.body.request.intent.name;
        switch (intentName) {
            case "SayHello":
                var resp = alexa.sayHello('Aditya');
                res.status(200).json(resp);
                break;
            case "AMAZON.CancelIntent":
                var resp = alexa.sayGoodBye();
                res.status(200).json(resp);
                break;
            case "GetTasks":
                var date = "19 Jul 2017 01:35 pm";
                var id = "1002";
                db.collection(COLLECTION.USERS).find({
                    $and: [{
                            "_id": id
                        },
                        {
                            "tasks": {
                                $elemMatch: {
                                    "date": date
                                }
                            }
                        }
                    ]
                }).toArray(function(err, docs) {
                    if (err) {
                        handleError(res, err.message, "Error in finding tasks for the user");
                    } else {
                        $elemMatch: {
                            docs
                        }
                        var resp = alexa.sayTasks(docs);
                        res.status(200).json(resp);
                        /*if (docs.length > 0) {
                            var resp = alexa.sayTasks(docs);
                            res.status(200).json(resp);
                        } else {
                            handleError(res, "No tasks scheduled yet");
                        }*/
                    }
                });

                break;

            case "ReadHealthData":
                var date = req.body.request.intent.slots.day.value; //2017-07-24
                var id = "1002";
                var slotName = req.body.request.intent.slots.measurementType.value; //steps
                console.log("Slot:" + slotName + " Date:" + date);
                db.collection(COLLECTION.USERS).aggregate([
                    { $match: { $and: [{ 'healthdata.date': date }, { 'healthdata.type': slotName }] } },
                    {
                        $project: {
                            "healthdata": {
                                $filter: {
                                    input: '$healthdata',
                                    as: 'healthdata',
                                    cond: { $eq: ['$$healthdata.type', slotName], $eq: ['$$healthdata.date', date] }
                                }
                            },
                        }
                    }
                ]).toArray(function(err, docs) {
                    if (err) {
                        handleError(res, err.message, "You don't have data for " + slotName);
                    } else {
                        $elemMatch: {
                            docs
                        }
                        var resp = alexa.readData(docs, slotName);
                        res.status(200).json(resp);
                    }
                });
                break;

            case "LogHealthData":
                var date = req.body.request.intent.slots.day.value;
                var id = "1002";
                var slotName = req.body.request.intent.slots.measurementType.value;
                db.collection(COLLECTION.USERS).findOneAndUpdate({
                    "_id": id
                }, {
                    $addToSet: {
                        "healthdata": {
                            "type": slotName,
                            "value": newTask.taskType,
                            "date": date
                        }
                    }
                }).then((resp) => {
                    console.log('Task Successfully inserted');
                    res.status(200).json({
                        "success": "Task scheduled successfully"
                    });
                }, (er) => {
                    handleError(res, er.message, "Schduling task failed, please try again after sometime");
                });
                break;
        }
    }
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});