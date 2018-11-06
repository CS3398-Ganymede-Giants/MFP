//using express.js just because it's relatively user friendly
const express = require('express')


//test databse code
// const { Client } = require('pg');
//testing postgres code 
var pg = require('pg')
var format = require('pg-format')
//postgres credentials
//test postgres code
const PGUSER = 'jameslaroux'
const PGDATABASE = 'testdb'

//making the express object that will be used to control our server
const app = express()

//requestjs
// const Request = require('request');
// const request = Request()

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
    // console.log("TEST")
});

//for testing page
app.get('/test.html', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/html/test.html'));
    // console.log("test.html")
});

app.get('/signupPage.html', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/html/signupPage.html'));
});

app.get('/userinfo.html', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/html/userinfo.html'));
});

app.get('/contactus.html', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/html/contactus.html'));
});

app.get('/trackingPage.html', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/html/trackingPage.html'));
});

//EXPRESS HTTP REQUESTS

//for searching user
app.get('/user/:id', function(req, res) {


    
    //user to search 
     //this outputs 
    // { username: 'asdf'}
    // console.log(req.query)
    //NEED TO GET FROM REQUEST
    var userId = req.query['username'];
   
    //config for connecting to databse
    var config = {
        user: PGUSER, // name of the user account
        database: PGDATABASE, // name of the database
        max: 10, // max number of clients in the pool
        idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
    }
    
    //more config
    var pool = new pg.Pool(config)
    var myClient

    //searching for user in database
    pool.connect(function (err, client, done) {
        if (err) console.log(err)
        console.log("\n\n\n\n\n\n\n\n\n\n")


        //query data
        myClient = client
        console.log(client)
        var ageQuery = format('SELECT * from user_tbl WHERE username = %L', userId)
        myClient.query(ageQuery, function (err, result) {
        if (err) {
            console.log(err)
            // res.send({ status: 'FAILED' });
        }
        // console.log(result.rows[0])

        //see if user is found 
        // console.log("RESULT")
        console.log(result)
        //if there's not 0 entries
        if(result != undefined) {
            if (result.rows[0] != undefined) {
                console.log("User found!")
                res.send({ data: true });
                // done()
            } else {
                console.log("User NOT found")
                res.send({ data: false });
                // done()
            }
        } else {
            console.log("NO ENTRIES FOUND")
                res.send({ data: false });
                // done()
        }
        

        

        })
    })




        // res.send('user ' + req.params.id);
        // res.send({ status: 'SUCCESS' });
  });

  app.get('/user/:id/failed', function(req, res) {
    // res.send('user ' + req.params.id);
    res.send({ status: 'FAILED' });
  });


//for searching user
app.get('/userlogin', function(req, res) {

    //console.log("node login")
    
    //user to search 
     //this outputs 
    // { username: 'asdf'}
    // //console.log(req.query)
    //NEED TO GET FROM REQUEST
    var username = req.query['username'];
    var passw = req.query['passwd']
   
    //config for connecting to databse
    var config = {
        user: PGUSER, // name of the user account
        database: PGDATABASE, // name of the database
        max: 10, // max number of clients in the pool
        idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
    }
    
    //more config
    var pool = new pg.Pool(config)
    var myClient

    //searching for user in database
    pool.connect(function (err, client, done) {
        // if (err) console.log(err)
        // console.log("\n\n\n\n\n\n\n\n\n\n")


        //query data
        myClient = client
        // console.log(client)
        // var ageQuery = format('SELECT * from user_tbl WHERE username = %L', userId)
        // myClient.query(ageQuery, function (err, result) {
        // if (err) {
        //     console.log(err)
        //     // res.send({ status: 'FAILED' });
        // }
        // // console.log(result.rows[0])

        const query = {
            text: 'SELECT user_id FROM user_tbl WHERE username = $1 AND passw = $2',
            values: [username, passw],
        }
        

        myClient.query(query, function (err, result) {
            if (err) {
                console.log(err)
                // res.send({ data: false });
            } else {
                //see if user is found 
                console.log("RESULT")
                // console.log("\n\n\n\n\n")
                // console.log(result)
                //if there's not 0 entries
                if(result != undefined) {
                    if (result.rows[0] != undefined) {
                        console.log("User found!")
                        // console.log("\n\n\n\n\n\n")
                        console.log("result")
                        // console.log(result.rows[0])
                        res.send({ data: true });
                        // done()
                    } else {
                        console.log("User NOT found")
                        res.send({ data: false });
                        // done()
                    }
                } else {
                    console.log("NO ENTRIES FOUND")
                        res.send({ data: false });
                        // done()
                }
            }
        
        })
                // console.log(result)
                // res.send({ data: true });
            
        })

    //     client.query('SELECT user_id FROM user_tbl WHERE username = $1 AND passw = $2', username, passw)
    //   .then(res => {
    //     if (res) {
    //       client.end();
    //       return true;
    //     } else {
    //       client.end();
    //       return false;
    //     }
    //   })
    //   .catch(e => console.error(e.stack));

        
    
        // res.send('user ' + req.params.id);
        // res.send({ status: 'SUCCESS' });
  });

//for searching user
app.get('/createuser', function(req, res) {


    //test postgres code

    //user to search 
     //this outputs 
    // { username: 'asdf'}
    // console.log(req.query)
    //NEED TO GET FROM REQUEST
    var username = req.query['username'];
    var passw = req.query['passwd'];
    var firstName = req.query['firstName'];
    var lastName = req.query['lastName'];



   
    //config for connecting to databse
    var config = {
        user: PGUSER, // name of the user account
        database: PGDATABASE, // name of the database
        max: 10, // max number of clients in the pool
        idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
    }
    
    //more config
    var pool = new pg.Pool(config)
    var myClient

    //searching for user in database
    pool.connect(function (err, client, done) {
        if (err) console.log(err)

        //query data
        myClient = client
        //format for inserting user 
        //'INSERT INTO users(name, email) VALUES($1, $2)',
        // username, email, first/last name, password
        // var ageQuery = format('SELECT * from users WHERE userId = %L', userId)
        // myClient.query(ageQuery, function (err, result) {
        // if (err) {
        //     console.log(err)
        //     res.send({ status: 'FAILED' });
        // }

        // const queryText = format('INSERT INTO user_tbl VALUES ($1, $2, $3, $4) RETURNING user_id', username, passw, firstName, lastName)
        
        const query = {
            text: 'INSERT INTO user_tbl VALUES ($1, $2, $3, $4, $5) RETURNING user_id',
            values: [username, 3, passw, firstName, lastName],
        }
        // myClient.query(ageQuery, function (err, result) {
        //     if (err) {
        //         console.log(err)
        //         // res.send({ status: 'FAILED' });
        //     }

        myClient.query(query, function (err, result) {
            if (err) {
                console.log(err)
                res.send({ data: false });
            } else {
                res.send({ data: true });
            }
        })
       

        done()

        })
    })




        // res.send('user ' + req.params.id);
        // res.send({ status: 'SUCCESS' });


  app.get('/user/:id/failed', function(req, res) {
    // res.send('user ' + req.params.id);
    res.send({ status: 'FAILED' });
  });



//telling the server to listen on the assigned port
app.listen(port, () => console.log(`App listening on port ${port}!`))


// a 404 page just cause 
app.use(function (req, res, next) {
  res.status(404).send("Sorry, page doesn't exist!")
})

//test express code
// app.get('/get.json', function(req, res){
//     console.log("DONE")
//     // res.send('user ' + req.params.id);
//     res.send('testresponse')
// });

// app.get('/post.json', function(req, res){
//     console.log("DONE")
//     // res.send('user ' + req.params.id);
//     res.send('testresponse')
// });

// app.get('/', function (req, res) {
//     //test json object 
//     var testJson = { "nine": 9, "ten": 10, "eleven": 11 }
//     res.send(testJson)
    
//   })



app.use(function (req, res, next) {
    console.log('Time:', Date.now())
    next()
})


//database code 
// const { Client } = require('pg');

// const client = new Client({
//   connectionString: process.env.DATABASE_URL,
//   ssl: true,
// });

// client.connect();

// client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
//   if (err) throw err;
//   for (let row of res.rows) {
//     console.log(JSON.stringify(row));
//   }
//   client.end();
// });





// //testing postgres code 
// var pg = require('pg')
// var format = require('pg-format')
// var PGUSER = 'jameslaroux'
// var PGDATABASE = 'testdb'
// var age = 732


// var config = {
//     user: PGUSER, // name of the user account
//     database: PGDATABASE, // name of the database
//     max: 10, // max number of clients in the pool
//     idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
//   }
  
//   var pool = new pg.Pool(config)
//   var myClient


//   pool.connect(function (err, client, done) {
//     if (err) console.log(err)
//     app.listen(3000, function () {
//       console.log('listening on 3000')
//     })
//     myClient = client
//     var ageQuery = format('SELECT * from numbers WHERE age = %L', age)
//     myClient.query(ageQuery, function (err, result) {
//       if (err) {
//         console.log(err)
//       }
//       console.log(result.rows[0])
//     })
//   })








//   //axios code 
// //   import axios from 'axios'
// const axios = require('axios');

// // axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
// //   .then(response => {
// //     console.log(response.data.url);
// //     console.log(response.data.explanation);
// //   })
// //   .catch(error => {
// //     console.log(error);
// //   });



// let body = [];
// request.on('data', (chunk) => {
//   body.push(chunk);
// }).on('end', () => {
//   body = Buffer.concat(body).toString();
//   // at this point, `body` has the entire request body stored in it as a string
// });
//