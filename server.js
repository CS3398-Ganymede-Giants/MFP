var http = require('http');

var userCount = 0;
http.createServer(function (request, response) {
    console.log('New connection');
    userCount++;

    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.write('Hello!\n');
    response.write('We have had '+userCount+' visits!\n');
    response.end();
}).listen(8080);

console.log('Server started');
// // Importing the http module
// var http = require('http');
// 
// // set the port of our application
// // process.env.PORT lets the port be set by Heroku
// // this is necessary because at deploy time, Heroku decides what port the application runs on.
// var port = process.env.PORT || 8080; 
// 
// // Creating the server, telling it to listen on the port Heroku Assigns
// http.createServer(function (request, response) {
//     response.writeHead(200, {'Content-Type': 'text/plain'});
//     response.end('Hello World!!!\nTesting Different Branches Deploying to Heroku');
// }).listen(port);
// 
// //Simple console log confirmation
// console.log('Server started');
// 
// 
// 