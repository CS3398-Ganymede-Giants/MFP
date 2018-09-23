//using express
const express = require('express')
const app = express()
// // set the port of our application
// // process.env.PORT lets the port be set by Heroku
// // this is necessary because at deploy time, Heroku decides what port the application runs on.
var port = process.env.PORT || 8080; 


app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


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