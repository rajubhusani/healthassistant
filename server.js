var http = require('http');
var server = http.createServer(function(request, response) {

    response.writeHead(200, {
        "Content-Type": "text\plain"
    });
    if (request.method == "GET") {
        response.send(JSON.stringfy({'message':'Hello Test'}));
        response.end("received GET request.")
    } else if (request.method == "POST") {
        response.end("received POST request.");
    } else {
        response.end("Undefined request .");
    }
});

var port = process.env.PORT;
var host = 'https://healthassistantalexa.herokuapp.com/';
server.listen(port, host);
console.log('Listening at ' + host + ':' + port);