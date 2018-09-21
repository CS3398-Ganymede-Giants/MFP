var http = require('http');

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080; 

http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Hello World!\n');
}).listen(port);

console.log('Server started');

