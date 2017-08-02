var alexa = module.exports = {};
var format = require('string-format');

alexa.sayHello = function(username) {
    var speakText = format("<speak><p>Hi {}, welcome to HealthAssistant, <break strength='none' time='1s'/> How may I help you? </p></speak>", username);

    return alexa.getSSMLResponse(speakText, false, false);
};

alexa.sayGoodBye = function() {
    var text = format("<speak><p>Goodbyebreak strength='none' time='750ms'/>hope you come back soon</p></speak>");
    return alexa.getSSMLResponse(text, true, false);
};

alexa.sayTasks = function(taskResponse) {
    if (typeof taskResponse !== undefined && taskResponse.length > 0) {
        var text = "<speak>You have " + taskResponse[0].tasks[0].taskDesc + " " + taskResponse[0].tasks[0].tasktype + " at " + taskResponse[0].tasks[0].time + "<break strength='none' time='750ms'/> Is there anything else I can help with?</speak>";
        return alexa.getSSMLResponse(text, false, false);
    } else {
        var text = "<speak>You have no tasks<break strength='none' time='750ms'/> Is there anything else I can help with?</speak>";
        return alexa.getSSMLResponse(text, false, false);
    }

};

alexa.sayTips = function(taskResponse) {
    if (typeof taskResponse !== undefined && taskResponse.length > 0) {
        var text = "<speak>" + taskResponse[0].tips[0].value + "<break strength='none' time='750ms'/> Is there anything else I can help with?</speak>";
        return alexa.getSSMLResponse(text, false, false);
    } else {
        var text = "<speak>You have no tips<break strength='none' time='750ms'/> Is there anything else I can help with?</speak>";
        return alexa.getSSMLResponse(text, false, false);
    }
};

alexa.readData = function(taskResponse, measurement) {
    console.log('Data Send to Alexa: ', JSON.stringify(taskResponse));
    var alexaText = "<speak><p>You have not captured your readings.. <break strength='none' time='750ms'/> Is there anything else I can help with? </p></speak>";
    if (typeof taskResponse !== undefined && taskResponse.length > 0) {
        var response = JSON.stringify(taskResponse);
        if (!taskResponse || taskResponse.length !== 0) {
            alexaText = "<speak><p>Your " + measurement + " value is " + taskResponse[0].healthdata[0].value + "</speak></p>";
        }
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