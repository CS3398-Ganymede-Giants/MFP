//NOTES
//
// to run locally
// try in terminal with heroku cli:
// >> DATABASE_URL=$(heroku config:get DATABASE_URL -a ganymede18) npm start


//using express.js just because it's relatively user friendly
const express = require('express')
//post json parser
const bodyParser = require('body-parser')
//email.js
const Email = require('./src/js/email.js')
//making new email object with email to send to 
var emailObj = new Email()

//alert 
// import alert from 'alert-node'
// var alert = require('alert-node')

//baseurl
// var baseUrl = "http://localhost:8080"
var baseUrl = "https://ganymede18.herokuapp.com"
//email instance 

//test databse code
// const { Client } = require('pg');
//testing postgres code
var pg = require('pg')
var format = require('pg-format')


//heroku postgres code
//connecting when the app initializes
const { Client } = require('pg');

//heroky pg client
const herokuClient = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});
//connecting
herokuClient.connect();

// herokuClient.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
//   if (err) throw err;
//   for (let row of res.rows) {
//     // console.log(JSON.stringify(row));
//   }
// //   herokuClient.end();
// });
//end heroku code

//Express code
//making the express object that will be used to control our server
const app = express()

//for cookies
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session')
app.use(cookieParser());

//for json parser
app.use(bodyParser.json());


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
//serving up scripts
// app.use(express.static('scripts'))

//basic response for the homepage, basic url '/'', sending the main.html file, which loads the
//CSS and JS in /public/ and /src/
// viewed at http://localhost:8080 on local machines
app.get('/', function(req, res) {
    console.log("\n\napp.get('/'\n\n")
    //user logged in or not
    var isLoggedIn = req.cookies['loggedIn']
    console.log(req.cookies)

    if (isLoggedIn == true) {
        // res.sendFile(path.join(__dirname + '/public/html/loginConfirmation.html'));
        console.log("redirect")
        //set cookies 
        res.cookie('user_id', req.cookies['user_id'])
        res.redirect(baseUrl + "/loginConfirmation.html")
    } else {
        // alert("test")
        res.cookie('user_id', -1)
        res.cookie('loggedIn', false)
        res.sendFile(path.join(__dirname + '/public/html/main.html'));
    }

    // console.log("TEST")
});

//for saving user posts 
app.post("/saveposts", function(req, response) {
    //print data to test 
    console.log("in saving post psot sptos tpsot")
    console.log(req.body)

    //query = 
    //INSERT INTO user_posts_tbl (user_id, post_text) VALUES (%L, %L)
    var query = format("INSERT INTO user_posts_tbl (user_id, post_text) VALUES (%L, %L) RETURNING timestamp", req.body.user_id, req.body.postText)

    //query 
    herokuClient.query(query, function(err, res) {
        if(!err) {
            console.log("NO error ")
            response.setHeader('Content-Type', 'application/json');
            response.json({ didAdd: true, data: res.rows})
        } else {
            console.log("Error")
            response.setHeader('Content-Type', 'application/json');
            response.json({ didAdd: false })
        }
    })

    
})

//viewing other user 
// app.get("/viewOtherUser/:username", function(req, response) {
//     //req.params should have vars
//     console.log("VIEW OTHER USER")
//     response.cookie("otherUserToView", req.params.username)
//     // response.setHeader('Content-Type', 'text/html')
//     // response.sendFile(path.join(__dirname + '/public/html/viewUser.html'));
//     // response.end()
//     // response.redirect(baseUrl + "/viewUser.html")
//     response.sendFile(path.join(__dirname + '/public/html/viewUser.html'));
// })

app.get('/viewUser.html', function(req, response) {
    // response.setHeader('Content-Type', 'text/html')
    // response.sendFile(path.join(__dirname + '/public/html/viewUser.html'))
    // response.end()
    console.log("VIEW OTHER USER")
    // response.cookie("otherUserToView", req.params.username)

    // response.redirect(baseUrl + "/viewUser.html")
    response.sendFile(path.join(__dirname + '/public/html/viewUser.html'));
})

//loading posts 
app.get("/loadUserPosts/:user_id", function(req, response) {
    //userid
    var user_id = req.params['user_id']

    //query 
    //SELECT * FROM user_posts_tbl WHERE user_id = %L
    var query = format("SELECT * FROM user_posts_tbl WHERE user_id = %s", user_id)

    //heroku client 
    herokuClient.query(query, function(err, res) {
        if (!err) {
            console.log("no error in loading user posts")
            //return data 
            response.setHeader('Content-Type', 'application/json');
            response.json(JSON.stringify({data:res.rows, didLoad: true}))

        } else {
            console.log("error in loading user posts")
            console.log(err)
            response.setHeader('Content-Type', 'application/json');
            response.json(JSON.stringify({ data: [], didLoad: false }))
        }
    })
})

app.get('/loadOtherUserPosts/:username', function(req, response) {
    //query 
    var query = format("SELECT user_id FROM user_tbl WHERE username = %L", req.params['username'])

    herokuClient.query(query, function(err, res) {
        if(!err) {
            console.log("RESPONSE ")
            console.log(res)
            var user_id = res.rows[0].user_id

            var query2 = format("SELECT * FROM user_posts_tbl WHERE user_id = %L", user_id)

            herokuClient.query(query2, function(err,res) {
                if (!err) {
                    console.log("RESPONSE 2")
                    console.log(res)
                    var posts = res.rows

                    response.setHeader('Content-Type', 'application/json');
                    response.json({data: posts, didLoad: true})
                } else {
                    response.setHeader('Content-Type', 'application/json');
                    response.json({ data: [], didLoad: false })
                }
            })
        } else {
            response.setHeader('Content-Type', 'application/json');
            response.json({ data: [], didLoad: false })
        }
        
    })
})

//for testing page
app.get('/test.html', function(req, res) {
    //creating cookie
    // res.cookie("key", "value")
    res.cookie('loggedIn', false)

    res.sendFile(path.join(__dirname + '/public/html/test.html'));
    // console.log("test.html")

});

app.get('/signupPage.html', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/html/signupPage.html'));
});

app.get('/emailConfirmation', function(req, response) {
console.log("in email confirmation")
    //need to get user_id from cookie
    var user_id = req.cookies['user_id']
    //also email from user_tbl
    var query = format("select * from user_tbl where user_id = %L;", user_id)

    //querying
    herokuClient.query(query, function(err, res) {
        //if error
        if (err) {
            throw err;
        } else {
            //no error 
            console.log(res.rows)

            //only need to send email if email isn't verified already 
            if (res.rows[0].email_verified == false) {
                //res.rows[0].email_address has email address
                var emailToSendTo = res.rows[0].email_address

                //now we can actually send it
                //need to set email first 
                emailObj.setEmail(emailToSendTo, user_id)
                //generate link to send
                var linkToSend = emailObj.generateRandomUrl()
                //email the link
                emailObj.sendEmail(linkToSend)
                //send emailConfirmation page
                response.sendFile(path.join(__dirname + '/public/html/emailConfirmation.html'));
            } else {
                //if email is verified 
                response.sendFile(path.join(__dirname + '/public/html/loginConfirmation.html'));
            }
            
            
        }
    })

   

    
});


//getting for email 
app.get('/emailConfirm', function (req, response) {
    //params have code 
    var code = req.query.code//['code']

    //get cookie one last time 
    // var userId = req.cookies['user_id']
    var userId = req.query.id

    //need to compare to active codes
    var isActive = emailObj.isActiveCode(code)

    console.log("code")
    console.log(code)
    console.log("user id")
    console.log(userId)
    console.log(isActive)
    console.log(emailObj.getCodes())

    //if active code 
    if (/*isActive == */true) {
        //set cookies
       
        // res.cookie("usersName", username)
        //saving user_id
        // res.cookie("user_id", result.rows[0].user_id)
        //code removed already


        //replace email_verified in user_tbl
        var query = format("UPDATE user_tbl SET email_verified = %L WHERE user_id = %L ", true, userId)
        console.log("query")
        console.log(query)
        //query reqyest 
        herokuClient.query(query, function (err, res) {
            if (err) {
                console.log("Error updating email_verified")
                console.log(err)
            } else {
                //no error 

                //remove email 
                emailObj.deleteEmail()
                //redirect to loginConfirmation
                //set cookies 
                // res.cookie
                response.cookie("loggedIn", true)
                response.cookie("user_id", userId)
                response.cookie("showModal", true)
                response.redirect(baseUrl + "/loginConfirmation.html")

            }
        })


    } else {
        //not active code
        //redirect to loginConfirmation
        res.redirect(baseUrl + "/loginConfirmation.html")


    }
})


app.get('/userinfo.html', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/html/userinfo.html'));
});

app.get('/contactus.html', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/html/contactus.html'));
});

app.get('/trackingPage.html', function(req, res) {

    res.sendFile(path.join(__dirname + '/public/html/trackingPage.html'));
});
app.get('/accountSettings.html', function(req, res) {

    res.sendFile(path.join(__dirname + '/public/html/accountSettings.html'));
});

//testing email 
app.get('/test', function(req, res) {
    

    //

    // console.log(emailObj.email)
    // console.log(emailObj.generateRandomUrl())
    // console.log(emailObj.getCodes())
})

app.get('/loginConfirmation.html', function(req, res) {

    //check if email is verified 
    //get user id from request 
    var user_id = req.cookies['user_id']
    console.log("USER ID IS ")
    console.log(user_id)
    //resetting cookies 
    res.cookie("otherUserToView", "")
    res.cookie("usernameToView", "")

    //if not logg
    
    //check email verified
    var query = format("SELECT * FROM user_tbl where user_id = %L", user_id)


    //stting email verified
    //UPDATE user_tbl WHERE user_id = <user_id from cookie> SET email_verified = TRUE
    //first query
    herokuClient.query(query, function (err, result) {
        if (err) {
            console.log(err)
            res.send({ data: false });
        } else {
        
            console.log("no error in searching for user")
            console.log(result.rows)
            // console.log(result.rows[0].email_verified)
            var username = result.rows[0].firstname
            res.cookie("usersName", username)
            // res.cookie("showModal", true)
            //adding to table
            //query 2
            //second new query string 
            //result has data 
            var emailIsVerified = result.rows[0].email_verified

            //if email is verified
                //redirect to login page 
            //if email not verified
                //send main page with alert to check email
            if (emailIsVerified == true) {
                //send the file 
                // res.cookie("showModal", true) //TODO change
                res.sendFile(path.join(__dirname + '/public/html/loginConfirmation.html'));
            } else {
                // res.sendFile(path.join(__dirname + '/public/html/emailConfirmation.html'));
                // res.redirect(baseUrl + "/emailConfirmation.html")
                res.redirect(baseUrl + "/emailConfirmation")
            }
                    
            // herokuClient.query(query2, function (err, result) {
            //     if (err) {
            //         console.log(err)
            //         res.send({ data: false });
            //     } else {
            //         console.log("\n\nno error in adding\n\n")
            //         console.log(result)
            //         // res.cookie("usersName", username)
            //         return res.send({ data: true });
            //     }
            // })
            // return res.send({ data: true });
        }
    })

    // res.sendFile(path.join(__dirname + '/public/html/loginConfirmation.html'));
});

app.get('/userinfo.html', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/html/userinfo.html'));
});

app.get('/contact.html', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/html/contact.html'));
});


//getting data 
app.get('/loaddata/all/:id/:tbl', function(req, res) {
    console.log("\nLOADING DATA in table "+ req.params.tbl + "\n")
     //need to load the data again
     //connecting for heroku client
    //  herokuClient.connect()

     //getting user id
     var userId = req.params.id
     //getting type
     var tbl = req.params.tbl

     //need to run different commands
     //vars for commands
     var queryString;
     var values;
     var query;
        if(tbl == 'individual_expense_tbl') {
            queryString = format("select * from individual_expense_tbl where user_id = %L;", userId)
        }
        if(tbl == 'individual_income_tbl') {
            console.log("LOADING INCOME TABLE")
            queryString = format("select * from individual_income_tbl where account_id in (select account_id from account_tbl where user_id = %L);", userId)
        }
        if(tbl == 'account_tbl') {
            queryString = format("select * from account_tbl where user_id = %L;", userId)
        }
     //sql command with cars
     console.log(queryString)
    //  var newSql = "SELECT * from " + tbl + " WHERE user_id = %L"

    //  var dataQuery = format(newSql, userId)
     herokuClient.query(queryString, function (err, result) {
     if (err) {
         console.log(err)
         // res.send({ status: 'FAILED' });
     } else {
    //see if user is found
        // console.log("RESULT")
        // console.log(result)
        //if there's not 0 entries
        if(result != undefined) {
            if (result.rows[0] != undefined) {
                console.log("Data found! first")
                console.log(JSON.stringify(result.rows))
                res.setHeader('Content-Type', 'application/json');
                var jsonResponse = JSON.stringify(result.rows)
                //  res.send(jsonResponse);
                res.json(jsonResponse)
                res.end()
                // done()
            } else {
                console.log("Data NOT found")
                res.setHeader('Content-Type', 'application/json');
                var emptyArr
                res.json(JSON.stringify([]));
                // done()
            }
        } else {
            console.log("NO DATA FOUND")
            res.setHeader('Content-Type', 'application/json');
            res.json(JSON.stringify([]));
                // done()
        }
    }


    })
})

//getting data
app.get('/loadbudget/:id', function(req, res) {
    console.log("\n\nin budget data\n\n")
    // console.log(req.params.id)
     //need to load the data again
     //connecting for heroku client
    //  herokuClient.connect()
    console.log("here")
     //getting user id
     var userId = req.cookies['user_id']
     console.log("user id is " + userId)

     var dataQuery = format('SELECT SUM(balance) FROM account_tbl WHERE user_id = %L', userId)
     herokuClient.query(dataQuery, function (err, result) {
     if (err) {
         console.log("error in stuff")
         console.log(err)
         // res.send({ status: 'FAILED' });
     } else {
    //see if user is found
        console.log("RESULT")
        console.log(typeof result)
        console.log(result)
        //if there's not 0 entries
        if(result != undefined) {

            if (result.rows[0] != undefined) {
                console.log("Data found!")
                res.setHeader('Content-Type', 'application/json');
                var jsonResponse = JSON.stringify(result.rows)
                //  res.send(jsonResponse);
                res.json(jsonResponse)
                res.end()
                // done()
            } else {
                console.log("Data NOT found")
                res.setHeader('Content-Type', 'application/json');
                res.json({ data: "notfound" });
                // done()
            }
            // res.setHeader('Content-Type', 'application/json');
            // res.json(result.rows)
            // res.end()
        } else {
            console.log("NO DATA FOUND")
            res.setHeader('Content-Type', 'application/json');
            res.json({ data: "NOdatafound" });
            res.end()
                // done()
        }
        // res.end()
    }


    })
})


//EXPRESS HTTP REQUESTS

//for searching user
app.get('/user/:id', function(req, res) {


    //user to search
     //this outputs
    // { username: 'asdf'}
    // console.log(req.query)
    //NEED TO GET FROM REQUEST
    var userId = req.query['username'];
    res.cookie("usernameToView", req.query['username'])


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


    })

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

    // //more config
    // var pool = new pg.Pool(config)
    // var myClient

    const query = {
        text: 'SELECT user_id FROM user_tbl WHERE username = $1 AND passw = crypt($2, passw)',
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
                    //saving user_id
                    res.cookie("user_id", result.rows[0].user_id)

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


  });



//for searching user
app.get('/userlogout', function(req, res) {


   //logout
   //just need to clear cookie and reload main page
//    res.cookie()
    res.cookie("loggedIn", false)
    res.cookie("user_id", -1)
    res.cookie("showModal", false)
    res.cookie("usernameToView", "")
    res.cookie("otherUserToView", "")
    //redirect?
    res.redirect(baseUrl)
    res.send();

    console.log("LOGOUT CLICKED")

  });

app.get('/testresponse', function(req, res) {
    //testing for updating balance goal 
    //need to 
    //UPDATE rows in account_tbl SET WHERE user_id = <user_id> 
})

//for searching user
app.get('/createuser', function(req, res) {

    //user to search
     //this outputs
    // { username: 'asdf'}
    // console.log(req.query)
    //NEED TO GET FROM REQUEST
    var username = req.query.username;
    var passw = req.query.passw;
    var firstName = req.query.firstName;
    var lastName = req.query.lastName;
    //var userId = req.query['userId']
    var email = req.query.email

    // var query = {
    //     text: "INSERT INTO user_tbl (username, passw, firstname, lastname, email_address, email_verified) VALUES ($1, crypt($2, gen_salt('bf')), $3, $4, $5, $6) RETURNING user_id",
    //     values: [username, passw, firstName, lastName, email, TRUE]
    // }
   
    //query string 
    query = format("INSERT INTO user_tbl (username, passw, firstname, lastname, email_address, email_verified) VALUES (%L, crypt(%L, gen_salt('bf')), %L, %L, %L, %L) RETURNING user_id", username, passw, firstName, lastName, email, true) //TODO fix email

    herokuClient.query(query, function (err, result) {
        if (err) {
            console.log(err)
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ data: false }));
        } else {
            console.log("\n\nno error in adding\n\n")
            console.log("user id is ")
            console.log(result.rows[0].user_id)
            res.cookie("usersName", username)
            res.cookie("user_id", result.rows[0].user_id)
            res.cookie("showModal", true)
            //user id 
            var user_id = result.rows[0].user_id;
            var usersName = username;
            
            //TODO use simpler code

            //going to prepopulate the account_tbl with checking,savings,credit
            //hmm pausing on that
            //need to prepopulate account tables
                //insert into account_tbl (user_id, account_type, balance) values (<user_id from cookie>, 'Checking, Savings, or Credit', 500) on conflict on constraint unique_user_account do update set balance = account_tbl.balance + excluded.balance;
                //user_id
                // var user_id = "157"
                //query 
                // query = format("insert into account_tbl (user_id, account_type, balance) values (%L, %L, %L ;", user_id, 'Checking', 0)
                // query = format('insert into account_tbl (user_id, account_type, balance) values (%L, %L, %L) on conflict on constraint unique_user_account do update set balance = account_tbl.balance + excluded.balance;', user_id, "Checking", 0)
                // query = format("insert into account_tbl (user_id, account_type, balance) values (%L, %L, %L) on conflict on constraint unique_user_account do update set balance = account_tbl.balance + excluded.balance", user_id, "Checking", 0)
                var queryString = "insert into account_tbl (user_id, account_type, balance) values ($1, $2, $3) on conflict on constraint unique_user_account do update set balance = account_tbl.balance + excluded.balance"
                var valsArr = [user_id, "Checking", 0]
                query = {
                    text: queryString,
                    values:valsArr
                }
                
                //request 
                herokuClient.query(query, function (err, result) {
                    if (err) {
                        console.log(err)
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify({ data: false }));
                    } else {
                        console.log("\n\nno error in adding account\n\n")

                        //ading next account 
                        //query 
                        // query = format("insert into account_tbl (user_id, account_type, balance) values (%L, 'Savings', 0) on conflict on constraint unique_user_account do update set balance = account_tbl.balance + excluded.balance;", user_id)
                        var queryString = "insert into account_tbl (user_id, account_type, balance) values ($1, $2, $3) on conflict on constraint unique_user_account do update set balance = account_tbl.balance + excluded.balance"
                        var valsArr = [user_id, "Savings", 0]
                        query = {
                            text: queryString,
                            values:valsArr
                        }
                        //request 
                        herokuClient.query(query, function (err, result) {
                            if (err) {
                                console.log(err)
                                res.setHeader('Content-Type', 'application/json');
                                res.send(JSON.stringify({ data: false }));
                            } else {
                                console.log("\n\nno error in adding account\n\n")

                                //adding last account 
                                //query 
                                // query = format("insert into account_tbl (user_id, account_type, balance) values (%L, 'Credit', 0) on conflict on constraint unique_user_account do update set balance = account_tbl.balance + excluded.balance;", user_id)
                                var queryString = "insert into account_tbl (user_id, account_type, balance) values ($1, $2, $3) on conflict on constraint unique_user_account do update set balance = account_tbl.balance + excluded.balance"
                                var valsArr = [user_id, "Credit", 0]
                                query = {
                                    text: queryString,
                                    values:valsArr
                                }
                                //request 
                                herokuClient.query(query, function (err, result) {
                                    if (err) {
                                        console.log(err)
                                        res.setHeader('Content-Type', 'application/json');
                                        res.send(JSON.stringify({ data: false }));
                                    } else {
                                        console.log("\n\nno error in adding account\n\n")
                                        res.setHeader('Content-Type', 'application/json');
                                        res.cookie("usersName", username)
                                        res.cookie("user_id", user_id)
                                        // res.redirect('/emailConfirmation.html')
                                        res.send(JSON.stringify({ data: true, user_id: user_id }));
                                        

                                    }
                                })
                                

                            }
                        })
                        

                    }
                })
            }
        })

})


//saving user submitted data
app.post('/saveexpense', function(req, res) {
    console.log("IN SAVE EXPENSE")
    //getting data
    console.log("Responding to POST")
    console.log(req.body)
    // {test: 'testval'}

    //need to grab the data from the requet

    //vars
    //db string
    var db = req.body.db
    //storing full body
    var body = req.body
    //values store correctly

    // select value 'inc' is +, 'exp' is -
    //need to store in the correct database
    //query 1 and 2
    var query = {}
    var query2 = {}
    if (db === 'individual_expense_tbl') {
        //storing columns to add

        //formatting type 
        // var labelObject = {
        //     1: "Auto",
        //     2: "Home",
        //     3: "Food",
        //     4: "Entertainment"
        // }
        var labelArray = ["Auto", "Home", "Food", "Entertainment"]
        
        //new query string 
        //insert into individual_expense_tbl (expense_type_id, user_id, description, cost_amount) values ((select expense_type_id from expense_types_tbl where expense_type = '<Auto, Home, Food, Entertainment, or Miscellaneous>'), <user_id from cookie>, 'Auto insurance', 150);
        query = format("insert into individual_expense_tbl (expense_type_id, user_id, description, cost_amount, account_type) values ((select expense_type_id from expense_types_tbl where expense_type = %L), %L, %L, %L, %L);", labelArray[body.expense_type_id], body.user_id, body.description, body.cost_amount, body.account_type )
        //update account_tbl set balance = balance - 50 where user_id = <user_id from cookie> and account_type = 'Checking, Savings, or Credit';
        // query2 = format("update account_tbl set balance = balance - %L where user_id = %L and account_type = %L;", body.cost_amount, body.user_id, body.account_type)
        

    }
    if (db === 'individual_income_tbl') {

        //new query sring 
        //insert into account_tbl (user_id, account_type, balance) values (<user_id from cookie>, 'Checking, Savings, or Credit', 500) on conflict on constraint unique_user_account do update set balance = account_tbl.balance + excluded.balance;
        // query = format("insert into account_tbl (user_id, account_type, balance) values (%L, %L, %L) on conflict on constraint unique_user_account do update set balance = account_tbl.balance + excluded.balance;", body.user_id, body.account_type, body.income_amount)

        //second new query string 
        //insert into individual_income_tbl (account_id, description, income_amount) values ((select account_id from account_tbl where user_id = <user_id from cookie> and account_type = 'Checking or Savings or Credit'), 'Paycheck', 250);
        query = format("insert into individual_income_tbl (account_id, description, income_amount, account_type) values ((select account_id from account_tbl where user_id = %L and account_type = %L), %L, %L, %L);", body.user_id, body.account_type, body.description, body.income_amount, body.account_type )
        
    }

    //first query
    herokuClient.query(query, function (err, result) {
        if (err) {
            console.log(err)
            res.send({ data: false });
        } else {
            console.log("\n\nno error in adding\n\n")
            console.log(result)
            // res.cookie("usersName", username)
            //adding to table
            //query 2
            //second new query string 
                    
            // herokuClient.query(query2, function (err, result) {
            //     if (err) {
            //         console.log(err)
            //         res.send({ data: false });
            //     } else {
            //         console.log("\n\nno error in adding\n\n")
            //         console.log(result)
                    // res.cookie("usersName", username)
            return res.send({ data: true });
            //     }
            // })
            // return res.send({ data: true });
        }
    })


})

app.post('/updateaccounttbl', function(req, res) {
    //parse data 
    //vars 
    //is a post so req.body has sent body 
    var body = req.body 
    //user id 
    var user_id = req.cookies['user_id']
    //query 
    var query;
    //multiple queries 
    var valArr;
    //return json
    // response.setHeader('Content-Type', 'application/json');

    //test goal or balance 
    var whatToSet;

    if(body.balanceOrGoal === 'goal') {
        whatToSet = 'balance_goal'
    }
    if(body.balanceOrGoal === 'balance') {
        whatToSet = 'balance'
    }

    //test goal or balance 
    // if(body.balanceOrGoal === 'goal') {
        // add to goals 
        //need to get account id's 
        //select account_id from account_tbl where account_type = %L and user_id = %L
        query = format("select * from account_tbl where user_id = %L ",  user_id)

        herokuClient.query(query, function(err, result) {
            if (!err) {
                // console.log("LSDJF")
                // console.log(res)

                var responseRows = result.rows
                
                var accountIDs = {}
                accountIDs[responseRows[0].account_type] = responseRows[0].account_id
                accountIDs[responseRows[1].account_type] = responseRows[1].account_id
                accountIDs[responseRows[2].account_type] = responseRows[2].account_id
                // console.log(accountIDs)

                //UPDATE account_tbl SET balance_goal = <enter amount> WHERE account_id = <enter account_id></enter>
                query = format("UPDATE account_tbl SET " + whatToSet + " = %L where account_id = %L;", body.valueObj['Checking'], accountIDs['Checking'])
                //MULTIPLE QUERIES

                herokuClient.query(query, function (err, result) {
                    if (!err) {

                        // console.log("update1")
                        //new query 
                        query = format("UPDATE account_tbl SET " + whatToSet + " = %L where account_id = %L;", body.valueObj['Savings'], accountIDs['Savings'])
                        herokuClient.query(query, function (err, result) {
                            if (!err) {
                                // console.log(res)
                                // console.log("update2")
                                //new query 
                                query = format("UPDATE account_tbl SET " + whatToSet + " = %L where account_id = %L;", body.valueObj['Credit'], accountIDs['Credit'])

                                herokuClient.query(query, function (err, result) {
                                    if (!err) {
                                        // console.log(res)
                                        // console.log("update3")

                                        //no error 
                                        // response.setHeader('Content-Type', 'application/json');
                                        // response.json({didAdd: true})
                                        // return res.json({ data: true });
                                        // res.end()
                                        res.cookie("showModal", false)
                                        res.end(JSON.stringify({ didAdd: true }))

                                    } else {
                                        //error
                                        // console.log("ELSE")
                                        // response.setHeader('Content-Type', 'application/json');
                                        res.end(JSON.stringify({ didAdd: false }))
                                    }
                                })

                            } else {
                                //error
                                // console.log("ELSE")
                                // res.setHeader('Content-Type', 'application/json');
                                // res.json({ didAdd: "false" })
                                res.end(JSON.stringify({ didAdd: false }))
                            }
                        })

                    } else {
                        // console.log("ELSE")
                        //error
                        // res.setHeader('Content-Type', 'application/json');
                        // // response.json({ didAdd: false })
                        // res.json({ didAdd: "false" })
                        // res.end()
                        res.end(JSON.stringify({ didAdd: false }))
                    }
                })
                
            } else {
                //error
                // res.setHeader('Content-Type', 'application/json');
                // // response.json({ didAdd: false })
                // res.json({ didAdd: "false" })
                // res.end()
                res.end(JSON.stringify({ didAdd: false }))
            }
            
            
        })
        

        

    // }//where account_id in (select account_id from account_tbl where user_id = %L);
    // if(body.balanceOrGoal === 'balance') {

    //     console.log("balance")
    //     // res.setHeader('Content-Type', 'application/json');
    //     // return res.json({didAdd:true})
    //     res.end(JSON.stringify({ didAdd: true }))
        
    // }
})


app.get('/user/:id/failed', function(req, res) {
    // res.send('user ' + req.params.id);
    // res.send({ status: 'FAILED' });
    res.end(JSON.stringify({didAdd: true}))
});


//Initializing the server
//telling the server to listen on the assigned port
app.listen(port, () => console.log(`App listening on port ${port}!`))


// a 404 page just cause
app.use(function (req, res, next) {
  res.status(404).send("Sorry, page doesn't exist!")
})









//EMAIL
//woring

/*

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mfpganymede@gmail.com',
    pass: 'ganymede18'
  }
});

var mailOptions = {
  from: 'mfpganymede@gmail.com',
  to: 'jolaroux@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

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

/*

app.get('/createuser', function(req, res) {

    var expense_type_id = req.query['itemType'];
    var description = req.query['itemDescription'];
    var cost_amount = req.query['itemValue'];

    const query = {
        text: "INSERT INTO user_tbl (expense_type_id, description, cost_amount) VALUES ($1, $2, $3) RETURNING expense_id",
        values: [expense_type_id, description, cost_amount],
    }


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



    })
*/
