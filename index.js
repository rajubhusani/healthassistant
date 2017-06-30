var express = require('express');
var app = express();

var resp = {
  "version": "1.0",
  "response": {
    "outputSpeech": {
      "type": "SSML",
      "ssml": "<speak><p>You can say, what are my activities, record a measurement, or send a caregiver a message. </p></speak>"
    },
    "reprompt": {
      "outputSpeech": {
        "type": "SSML",
        "ssml": "<speak><p>You can say, what are my activities, record a measurement, or send a caregiver a message. </p></speak>"
      }
    },
    "speechletResponse": {
      "outputSpeech": {
        "ssml": "<speak><p>You can say, what are my activities, record a measurement, or send a caregiver a message. </p></speak>"
      },
      "reprompt": {
        "outputSpeech": {
          "ssml": "<speak><p>You can say, what are my activities, record a measurement, or send a caregiver a message. </p></speak>"
        }
      },
      "shouldEndSession": false
    }
  },
  "sessionAttributes": {
    "SayMsgData": "<p>You can say, what are my activities, record a measurement, or send a caregiver a message. </p>",
    "rePromtData": "<p>You can say, what are my activities, record a measurement, or send a caregiver a message. </p>",
    "requireLastIntent": false
  }
};

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  //response.render('pages/index');
  //console.log('Node app is running on port', app.get('port'));

  response.writeHead("200, {'Content-Type': 'text/html'}");
  response.end(resp);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


