var alexa = module.exports = {};

alexa.sayHello = function() {

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
    return resp;
};
