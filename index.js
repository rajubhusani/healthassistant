var express = require('express');
//var bodyParser = require("body-parser");
var app = express();

var resp = {
  "version": "1.0",
  "response": {
    "outputSpeech": {
      "type": "SSML",
      "ssml": "<speak><p>John, welcome back to HealthActivate, You have a medication reminder, <break strength='none' time='1s'/> at 08:20 AM you are scheduled to take your ACE medication.<break strength='none' time='750ms'/> How may I help you? </p></speak>"
    },
    "reprompt": {
      "outputSpeech": {
        "type": "SSML",
        "ssml": "<speak><p>You can say, what are my goals for today, what is my medication schedule, or message my health coach.</p></speak>"
      }
    },
    "speechletResponse": {
      "outputSpeech": {
        "ssml": "<speak><p>John, welcome back to HealthActivate, You have a medication reminder, <break strength='none' time='1s'/> at 08:20 AM you are scheduled to take your ACE medication.<break strength='none' time='750ms'/> How may I help you? </p></speak>"
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
    "SayMsgData": "<p>John, welcome back to HealthActivate, You have a medication reminder, <break strength='none' time='1s'/> at 08:20 AM you are scheduled to take your ACE medication.<break strength='none' time='750ms'/>  How may I help you? </p>",
    "rePromtData": "<p>You can say, what are my goals for today, what is my medication schedule, or message my health coach.</p>",
    "requireLastIntent": false
  }
};
//app.use(bodyParser.json());

 // var server = app.listen(process.env.PORT || 5000, function () {
 //    var port = server.address().port;
 //    console.log("App now running on port", port);
 //  });

app.set('port', (process.env.PORT || 5000));

//app.use(express.static(__dirname + '/public'));

// views is directory for all template files
//app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');

// app.get('/', function(request, response) {
//     //response.render('pages/index');
//     console.log('Node app is running on port');
//     response.status(200).json(JSON.stringify({'message':'Hello Test'}));

//     //response.writeHead("200, {'Content-Type': 'text/html'}");
//     //response.send(JSON.stringify(resp));
// });

app.post('/', function(request, response) {
    //response.render('pages/index');
    console.log('Node app is running on port');
    response.status(200).json(JSON.stringify(resp));

    //response.writeHead("200, {'Content-Type': 'text/html'}");
    //response.send(JSON.stringify(resp));
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});