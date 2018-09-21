var express = require('express');
var app = express();

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

// set the home page route
app.get('/', function(req, res) {

    // ejs render automatically looks in the views folder
    res.render('index');
});

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});
// var http = require('http');
// 
// http.createServer(function (request, response) {
//     response.writeHead(200, {'Content-Type': 'text/plain'});
//     response.end('Hello World\n');
// }).listen(8080);
// 
// console.log('Server started');
// 
// // const express = require('express')
// // const app = express()
// // const port = 3000
// // 
// // app.get('/', (req, res) => res.send('Hello World!'))
// // console.log("TEST")
// // app.listen(port, () => console.log(`Example app listening on port ${port}!`))