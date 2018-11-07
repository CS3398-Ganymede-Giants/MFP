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

//heroku postgres code
//connecting when the app initializes
const { Client } = require('pg');

const herokuClient = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

herokuClient.connect();

herokuClient.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
//   herokuClient.end();
});
//end heroku code

//making the express object that will be used to control our server
const app = express()

//for cookies
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session')
app.use(cookieParser());

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
    console.log("\n\napp.get('/'\n\n")
    // res.sendFile(path.join(__dirname + '/public/html/main.html'));
    // res.sendFile(path.join(__dirname + '/public/html/loginConfirmation.html'));

    //check for logged in cookie
    // console.log(document.cookie)
    // console.log(req.cookies['key'])
    // console.log(req.cookies)

    console.log("req.cookies")
    console.log(req.cookies['loggedIn'])

    if (req.cookies['loggedIn'] == true) {
        res.sendFile(path.join(__dirname + '/public/html/loginConfirmation.html'));
    } else {
        res.sendFile(path.join(__dirname + '/public/html/main.html'));
    }

    // console.log("TEST")
});

//for testing page
app.get('/test.html', function(req, res) {
    //creating cookie
    // res.cookie("key", "value")
    res.cookie('loggedIn', false)

    //deleting cookie
    // res.clearCookie('key')

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

app.get('/loginConfirmation.html', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/html/loginConfirmation.html'));
});

app.get('/userinfo.html', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/html/userinfo.html'));
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



    //connecting for heroku client
    herokuClient.connect()

    var ageQuery = format('SELECT * from user_tbl WHERE username = %L', userId)
    herokuClient.query(ageQuery, function (err, result) {
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

//////////////////////
/*

     //config for connecting to databse
    var config = {
        user: PGUSER, // name of the user account
        database: PGDATABASE, // name of the database
        max: 10, // max number of clients in the pool
        idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
    }

    //more config
    var pool = new pg.Pool(config)
    var myClient = client;

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
        */
/////////////////////////
    })





        // res.send('user ' + req.params.id);
        // res.send({ status: 'SUCCESS' });
  });

//   app.get('/user/:id/failed', function(req, res) {
//     // res.send('user ' + req.params.id);
//     res.send({ status: 'FAILED' });
//   });


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

    // //config for connecting to databse
    // var config = {
    //     user: PGUSER, // name of the user account
    //     database: PGDATABASE, // name of the database
    //     max: 10, // max number of clients in the pool
    //     idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
    // }

    // //more config
    // var pool = new pg.Pool(config)
    // var myClient

    const query = {
        text: 'SELECT user_id FROM user_tbl WHERE username = $1 AND passw = $2',
        // text: 'PREPARE userlogin (varchar, varchar) AS SELECT user_id FROM user_tbl WHERE username = \$1 AND passw = \$2; EXECUTE userlogin($1, $2)',
        values: [username, passw],
    }


    herokuClient.query(query, function (err, result) {
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
                    //set cookie
                    res.cookie("loggedIn", true)
                    res.cookie("usersName", username)

                    res.send({ data: true });
                    //redirect?
                    // res.redirect('/') //TODO UNCOMMENT
                    // done()


                } else {
                    console.log("User NOT found")
                    console.log("User data:" )
                    console.log(username)
                    console.log(passw)
                    res.cookie("loggedIn", false)
                    res.send({ data: false });
                    // res.redirect('/')
                    // done()
                }
            } else {
                console.log("NO ENTRIES FOUND")
                    res.send({ data: false });
                    // done()
            }
        }

    })

    /*
/////////////////
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
///////////////
        */
  });



//for searching user
app.get('/userlogout', function(req, res) {


   //logout
   //just need to clear cookie and reload main page
//    res.cookie()
    res.cookie("loggedIn", false)
    //redirect?
    res.redirect('https://ganymede18.herokuapp.com/')
    res.send();

    console.log("LOGOUT CLICKED")

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
    //var userId = req.query['userId']

    const query = {
        text: 'INSERT INTO user_tbl (username, passw, firstname, lastname) VALUES ($1, $2, $3, $4) RETURNING user_id',
        values: [username, passw, firstName, lastName],
    }
    // myClient.query(ageQuery, function (err, result) {
    //     if (err) {
    //         console.log(err)
    //         // res.send({ status: 'FAILED' });
    //     }

    herokuClient.query(query, function (err, result) {
        if (err) {
            console.log(err)
            res.send({ data: false });
        } else {
            console.log("\n\nno error in adding\n\n")
            res.cookie("usersName", username)
            res.send({ data: true });
        }
    })




    // //config for connecting to databse
    // var config = {
    //     user: PGUSER, // name of the user account
    //     database: PGDATABASE, // name of the database
    //     max: 10, // max number of clients in the pool
    //     idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
    // }

    // //more config
    // var pool = new pg.Pool(config)
    // var myClient
///////////////////////////
/*
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
/////////////////
*/
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


// var express = require('express');
// var app = express();
// var path = require('path');

// var cookieParser = require('cookie-parser');
// app.use(cookieParser());

// app.get('/', function(req, res) {
//     // res.sendFile(path.join(__dirname + '/public/html/main.html')); //TODO CHANGE BACK
//     res.sendFile(path.join(__dirname + '/public/html/mainLoggedIn.html'));
//     // console.log("TEST")
// });

// // app.get('/', function(req, res){
// //     //cookies
// //     res.cookie("key", "value")
// //     res.cookie("key2", "Value2")
// //     res.send('cookie set'); //Sets name = express
// // });

// // app.get('/test', function(req, res){
// //     // res.cookie('name', 'expressTEST').send('cookie set'); //Sets name = express
// //     res.clearCookie('key')
// //     res.clearCookie('key2')
// //     res.send('cleared cookie')
// //  });

// app.listen(3000);
