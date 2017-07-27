var alexa = module.exports = {};
var format = require('string-format');

alexa.sayHello = function(username) {
    var speakText = format("<speak><p>Hi {}, welcome to HealthAssistant, <break strength='none' time='1s'/> How may I help you? </p></speak>", username);

    return alexa.getSSMLResponse(speakText, false, false);
};

alexa.sayGoodBye = function() {
    var text = format("<speak><p>Goodbye {},</p></speak>", username);
    return alexa.getSSMLResponse(text, true, false);
};

alexa.sayTasks = function(taskResponse) {
    var text = "You have " + taskResponse[0].tasks[0].taskDesc + " " + taskResponse[0].tasks[0].tasktype + " at " + taskResponse[0].tasks[0].time;
    return alexa.getSSMLResponse(text, false, false);
};

alexa.readData = function(taskResponse, measurement) {
    console.log('Data Send to Alexa: ', JSON.stringify(taskResponse));
    var response = JSON.stringify(taskResponse);
    var alexaText = "<speak><p>You have not captured your readings.. <break strength='none' time='750ms'/> Is there anything else I can help with? </p></speak>";
    if (!taskResponse || taskResponse.length !== 0) {
        alexaText = "<speak><p>Your " + measurement + " value is " + taskResponse[0].healthdata[0].value + "</speak></p>";
    }

    return alexa.getSSMLResponse(alexaText, false, false);
};

alexa.getSSMLResponse = function(dynamicText, isEndSession, requireLastIntent) {
    var resp = {
        "version": "1.0",
        "response": {
            "outputSpeech": {
                "type": "SSML",
                "ssml": dynamicText
            },
            "reprompt": {
                "outputSpeech": {
                    "type": "SSML",
                    "ssml": "<speak><p>Is there anything else I can help with? </p></speak>"
                }
            },
            "speechletResponse": {
                "outputSpeech": {
                    "ssml": dynamicText
                },
                "reprompt": {
                    "outputSpeech": {
                        "ssml": "<speak><p>Is there anything else I can help with? </p></speak>"
                    }
                }
            },
            "shouldEndSession": isEndSession
        },
        "sessionAttributes": {
            "SayMsgData": dynamicText,
            "rePromtData": "<speak>Is there anything else I can help with? </speak>",
            "requireLastIntent": requireLastIntent
        }
    };
    // console.log(resp);
    return resp;
};