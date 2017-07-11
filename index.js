var express = require("express");
var CircularJSON = require("circular-json");

var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 5021));

var resp = {
    "version": "1.0",
    "response": {
        "outputSpeech": {
            "type": "SSML",
            "ssml": "<speak><p>Nagaraju, welcome back to HealthActivate, You have a medication reminder, <break strength='none' time='1s'/> at 08:20 AM you are scheduled to take your ACE medication.<break strength='none' time='750ms'/> How may I help you? </p></speak>"
        },
        "reprompt": {
            "outputSpeech": {
                "type": "SSML",
                "ssml": "<speak><p>You can say, what are my goals for today, what is my medication schedule, or message my health coach.</p></speak>"
            }
        },
        "speechletResponse": {
            "outputSpeech": {
                "ssml": "<speak><p>Nagaraju, welcome back to HealthActivate, You have a medication reminder, <break strength='none' time='1s'/> at 08:20 AM you are scheduled to take your ACE medication.<break strength='none' time='750ms'/> How may I help you? </p></speak>"
            },
            "reprompt": {
                "outputSpeech": {
                    "ssml": "<speak><p>You can say, what are my goals for today, what is my medication schedule, or message my health coach.</p></speak>"
                }
            },
            "shouldEndSession": false
        }
    },
    "sessionAttributes": {
        "SayMsgData": "<p>Nagaraju, welcome back to HealthActivate, You have a medication reminder, <break strength='none' time='1s'/> at 08:20 AM you are scheduled to take your ACE medication.<break strength='none' time='750ms'/>  How may I help you? </p>",
        "rePromtData": "<p>You can say, what are my goals for today, what is my medication schedule, or message my health coach.</p>",
        "requireLastIntent": false
    }
};

//app.use(express.static(__dirname + '/public'));

// views is directory for all template files
//app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');

// app.get('/', function(request, response) {
//     response.render('pages/index');
//     console.log('Node app is running on port');
//     response.status(200).json(JSON.stringify({'message':'Hello Test'}));
// });

app.post('/', function(req, response) {
    //response.render('pages/index');
    //var request = CircularJSON.stringify(req);
    console.log('Client Request=====>' + req.body);
    //console.log('Client Request=====>' + req.body.request.intent.name);
    response.status(200).json(resp);
});

app.post('/app/login', function(req, response) {

    var MongoClient = require('mongodb').MongoClient;
    var query = { email: req.body.username };
    MongoClient.connect('mongodb://adityakotamraju:Health123@ds151752.mlab.com:51752/health_assistant').then((db) => {
        db.collection("Users").find(query).toArray(function(err, resp) {
            if (err) {
                var error = {
                    "message": "Error in connection"
                };
                response.status(100).json(error);
            } else {
                response.status(200).json(resp);
            }
        });
    }).catch((err) => {
        console.error('Mongo Connection failed: ', err);
        return null;
    });
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});