var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var CircularJSON = require("circular-json");

var MONGO_CONNECTION_URL = 'mongodb://adityakotamraju:Health123@ds151752.mlab.com:51752/health_assistant';
var COLLECTION = {
    "USERS": "Users",
};

var app = express();
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 5008));

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

var db;
var alexa = require("./alexa/alexa_response");
var evaluator = require("./alexa/data_evaluation");

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
    console.log('Task Received: ', newTask);
    db.collection(COLLECTION.USERS).findOneAndUpdate({
        "_id": newTask._id
    }, {
        $addToSet: {
            "tasks": {
                "tasktype": newTask.taskType,
                "taskDesc": newTask.taskDesc,
                "date": newTask.date,
                "time": newTask.time
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
        var tips = evaluator.evaluate(newTask._id, newTask.value, type, db);
        if (tips !== null) {
            app.updateTips(newTask._id, tips);
        }
    }, (er) => {
        handleError(res, er.message, "Data insert failed, please try again after sometime");
    });
});

app.updateTips = function(userid, tip) {
    console.log('updateTips');
    db.collection(COLLECTION.USERS).findOneAndUpdate({
        "_id": userid
    }, {
        $addToSet: {
            "tips": {
                "value": tip
            }
        }
    }).then((resp) => {
        console.log('tip Successfully inserted');
    }, (er) => {
        console.log("tip insert failed, please try again after sometime");
    });
};

app.post("/alexa", function(req, res) {
    //console.log('Received request from alexa..!' + CircularJSON.stringify(req));
    var alexa_id = req.body.context.System.user.userId;
    //console.log(alexa_id);
    var userObj = null;
    db.collection(COLLECTION.USERS).find({
        "alexa_id": alexa_id
    }, { "_id": 1, "name": 1 }).toArray(function(err, docs) {
        if (err) {
            handleError(res, err.message, "Error in finding user details");
        } else {
            $elemMatch: {
                docs
            }
            userObj = docs[0];
            console.log(userObj);
            /////CODE ALEXA VOICE

            if (req.body.request.type === "LaunchRequest") {
                var resp = alexa.sayHello(userObj.name);
                res.status(200).json(resp);
            } else if (req.body.request.type === "IntentRequest") {
                var intentName = req.body.request.intent.name;
                console.log("Intent Name:" + intentName);
                switch (intentName) {
                    case "SayHello":
                        var resp = alexa.sayHello(userObj.name);
                        res.status(200).json(resp);
                        break;
                    case "AMAZON.CancelIntent":
                        var resp = alexa.sayGoodBye();
                        res.status(200).json(resp);
                        break;
                    case "GetTasks":
                        var date = req.body.request.intent.slots.day.value;
                        console.log('Date from Alexa: ', date);
                        var id = userObj._id;
                        db.collection(COLLECTION.USERS).find({
                            "_id": id,
                            "tasks": {
                                $elemMatch: {
                                    "date": date
                                }
                            }
                        }, { "tasks.$": 1 }).toArray(function(err, docs) {
                            if (err) {
                                handleError(res, err.message, "Error in finding tasks for the user");
                            } else {
                                $elemMatch: {
                                    docs
                                }
                                var resp = alexa.sayTasks(docs);
                                res.status(200).json(resp);
                            }
                        });
                        break;

                    case "ReadHealthData":
                        var date = req.body.request.intent.slots.day.value; //2017-07-24
                        var id = userObj._id;
                        var slotName = req.body.request.intent.slots.measurementType.value; //steps
                        console.log("Slot:" + slotName + " Date:" + date);
                        db.collection(COLLECTION.USERS).find({
                            "_id": id,
                            "healthdata": {
                                $elemMatch: {
                                    "date": date,
                                    "type": slotName
                                }
                            }
                        }, { "healthdata.$": 1 }).toArray(function(err, docs) {
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

                    case "GetTips":
                        var id = userObj._id;
                        db.collection(COLLECTION.USERS).find({
                            "_id": id
                        }, { "tips": 1 }).toArray(function(err, docs) {
                            if (err) {
                                handleError(res, err.message, "You don't have any tips");
                            } else {
                                $elemMatch: {
                                    docs
                                }
                                console.log(docs);
                                var resp = alexa.sayTips(docs);
                                res.status(200).json(resp);
                            }
                        });
                        break;

                        // case "LogHealthData":
                        //     var date = req.body.request.intent.slots.day.value;
                        //     var id = "1002";
                        //     var slotName = req.body.request.intent.slots.measurementType.value;
                        //     db.collection(COLLECTION.USERS).findOneAndUpdate({
                        //         "_id": id
                        //     }, {
                        //         $addToSet: {
                        //             "healthdata": {
                        //                 "type": slotName,
                        //                 "value": newTask.taskType,
                        //                 "date": date
                        //             }
                        //         }
                        //     }).then((resp) => {
                        //         console.log('Task Successfully inserted');
                        //         res.status(200).json({
                        //             "success": "Task scheduled successfully"
                        //         });
                        //     }, (er) => {
                        //         handleError(res, er.message, "Schduling task failed, please try again after sometime");
                        //     });
                        //     break;
                }
            }
            ///////END
        }
    });
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});