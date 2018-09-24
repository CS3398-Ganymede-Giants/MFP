//using express.js just because it's relatively user friendly
const express = require('express')

//making the express object that will be used to control our server
const app = express()

//so we can handle files more easily 
var path = require('path');

// // set the port of our application
// // process.env.PORT lets the port be set by Heroku
// // this is necessary because at deploy time, Heroku decides what port the application runs on.
var port = process.env.PORT || 8080; 

//telling express to serve everything in the public directory so we can use it on the page
//public contains html and css folders/code
app.use(express.static('public'))
//same thing for src directory, to serve javascript
app.use(express.static('src'))

//basic response for the homepage, basic url '/'', sending the main.html file, which loads the 
//CSS and JS in /public/ and /src/
// viewed at http://localhost:8080 on local machines
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/html/main.html'));
});

//telling the server to listen on the assigned port
app.listen(port, () => console.log(`App listening on port ${port}!`))


// a 404 page just cause 
app.use(function (req, res, next) {
  res.status(404).send("Sorry, page doesn't exist!")
})