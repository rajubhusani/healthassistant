var express = require('express');
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.json());

 var server = app.listen(process.env.PORT || 5000, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });

app.set('port', (process.env.PORT || 5000));

//app.use(express.static(__dirname + '/public'));

// views is directory for all template files
//app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');

app.get('/', function(request, response) {
    //response.render('pages/sample');
    console.log('Node app is running on port');
    response.status(200).json(JSON.stringify({'message':'Hello Test'}));

    //response.writeHead("200, {'Content-Type': 'text/html'}");
    //response.send(JSON.stringify(resp));
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});