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
    console.log('Task Received to Alexa: ', JSON.stringify(taskResponse));
};

alexa.readData = function(taskResponse, measurement) {
    console.log('Data Send to Alexa: ', JSON.stringify(taskResponse));
    var response = JSON.stringify(taskResponse);
    var alexaText = "<speak><p>You have not captured your readings.. <break strength='none' time='750ms'/> Is there anything else I can help with? </p></speak>";
    if (!taskResponse || taskResponse.length !== 0) {
        alexaText = "<speak><p>Your " + measurement + " value is " + taskResponse[0].healthdata[0].value; //+ "<break strength='none' time='750ms'/> Is there anything else I can help with? </p></speak>";
    }

    alexaText += alexa.advice(taskResponse[0].healthdata[0].value, measurement);
    return alexa.getSSMLResponse(alexaText, false, true);
};

alexa.advice = function(value, type) {
    console.log("Advice");
    var speakText = "<break strength='none' time='500ms'/>You have a health advice<break strength='none' time='750ms'/>";
    switch (type) {
        case "Blood Pressure":
            speakText = "Reduce the salt in your diet <break strength='none' time='750ms'/> Eat more fruits, vegetables, grains, and low-fat dairy foods";
            break;
        case "blood sugar":
            speakText = "Eliminate wheat in your diet <break strength='none' time='750ms'/> Check your stress level";
            break;
    }

    return speakText;
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
                },
                "shouldEndSession": isEndSession
            }
        },
        "sessionAttributes": {
            "SayMsgData": dynamicText,
            "rePromtData": "<p>Is there anything else I can help with? </p>",
            "orbitaSession": {},
            "requireLastIntent": requireLastIntent
        }
    };

    return resp;
};