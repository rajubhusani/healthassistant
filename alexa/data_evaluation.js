var dataEvaluator = module.exports = {};
var format = require('string-format');

dataEvaluator.evaluate = function(userid, value, type, dataBase) {
    console.log(type + '::' + value);
    var tip = null;
    switch (type) {
        case "blood pressure":
            var systolic = value.split("/")[0];
            var diastolic = value.split("/")[1];
            //HIGHBP
            if (systolic > 140 || diastolic > 90) {
                tip = "Reduce the salt in your diet<break strength='none' time='500ms'/>Eat more fruits, vegetables, grains, and low-fat dairy foods";
            }
            //LOWBP 
            else if (systolic < 90 || diastolic < 60) {
                tip = "Eat a diet higher in salt<break strength='none' time='500ms'/>Get regular exercise to promote blood flow";
            }
            break;
        case "blood sugar":
            if (value > 180) {
                tip = "Eliminate wheat in your diet <break strength='none' time='750ms'/> Check your stress level";
            } else if (value < 70) {
                tip = "Very low blood sugar is a medical emergency";
            }
            break;
    }
    return tip;
};