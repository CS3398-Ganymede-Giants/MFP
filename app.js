//NOTES
//
// to run locally
// try in terminal with heroku cli:
// >> DATABASE_URL=$(heroku config:get DATABASE_URL -a ganymede18) npm start


//using express.js just because it's relatively user friendly
const express = require('express')
//post json parser
var bodyParser = require('body-parser')

//baseurl
// var baseUrl = "http://localhost:8080"
var baseUrl = "https://ganymede18.herokuapp.com"

//for charts 
// var Chart = require('chart.js');
// var myChart = new Chart(ctx, {...});



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

//surrounding with try catch?
//maybe not

herokuClient.connect();

herokuClient.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    // console.log(JSON.stringify(row));
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

//for json parser
app.use(bodyParser.json());


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
//serving up scripts
// app.use(express.static('scripts'))

//basic response for the homepage, basic url '/'', sending the main.html file, which loads the
//CSS and JS in /public/ and /src/
// viewed at http://localhost:8080 on local machines
app.get('/', function(req, res) {
    console.log("\n\napp.get('/'\n\n")
    // res.sendFile(path.join(__dirname + '/public/html/main.html'));
    // res.sendFile(path.join(__dirname + '/public/html/loginConfirmation.html'));

    // console.log("req.cookies")
    // console.log(req.cookies['loggedIn'])

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
app.get('/accountSettings.html', function(req, res) {

    res.sendFile(path.join(__dirname + '/public/html/accountSettings.html'));
});

app.get('/loginConfirmation.html', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/html/loginConfirmation.html'));
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
    //redirect?
    res.redirect(baseUrl)
    res.send();

    console.log("LOGOUT CLICKED")

  });

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
    query = format("INSERT INTO user_tbl (username, passw, firstname, lastname, email_address, email_verified) VALUES (%L, crypt(%L, gen_salt('bf')), %L, %L, %L, %L) RETURNING user_id", username, passw, firstName, lastName, email, true)

    herokuClient.query(query, function (err, result) {
        if (err) {
            console.log(err)
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ data: false }));
        } else {
            console.log("\n\nno error in adding\n\n")
            // console.log("user id is ")
            // console.log(result.rows[0].user_id)
            res.cookie("usersName", username)
            res.cookie("user_id", result.rows[0].user_id)
            //user id 
            var user_id = result.rows[0].user_id
            
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
                                        res.send(JSON.stringify({ data: true }));
                                        

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
        
        //new query string 
        //insert into individual_expense_tbl (expense_type_id, user_id, description, cost_amount) values ((select expense_type_id from expense_types_tbl where expense_type = '<Auto, Home, Food, Entertainment, or Miscellaneous>'), <user_id from cookie>, 'Auto insurance', 150);
        query = format("insert into individual_expense_tbl (expense_type_id, user_id, description, cost_amount) values ((select expense_type_id from expense_types_tbl where expense_type = %L), %L, %L, %L);", body.expense_type, body.user_id, body.description, body.cost_amount )
        //update account_tbl set balance = balance - 50 where user_id = <user_id from cookie> and account_type = 'Checking, Savings, or Credit';
        query2 = format("update account_tbl set balance = balance - %L where user_id = %L and account_type = %L;", body.cost_amount, body.user_id, body.account_type)
        

    }
    if (db === 'individual_income_tbl') {

        //new query sring 
        //insert into account_tbl (user_id, account_type, balance) values (<user_id from cookie>, 'Checking, Savings, or Credit', 500) on conflict on constraint unique_user_account do update set balance = account_tbl.balance + excluded.balance;
        query = format("insert into account_tbl (user_id, account_type, balance) values (%L, %L, %L) on conflict on constraint unique_user_account do update set balance = account_tbl.balance + excluded.balance;", body.user_id, body.account_type, body.income_amount)

        //second new query string 
        //insert into individual_income_tbl (account_id, description, income_amount) values ((select account_id from account_tbl where user_id = <user_id from cookie> and account_type = 'Checking or Savings or Credit'), 'Paycheck', 250);
        query2 = format("insert into individual_income_tbl (account_id, description, income_amount) values ((select account_id from account_tbl where user_id = %L and account_type = %L), %L, %L);", body.user_id, body.account_type, body.description, body.income_amount )
        
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
                    
            herokuClient.query(query2, function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({ data: false });
                } else {
                    console.log("\n\nno error in adding\n\n")
                    console.log(result)
                    // res.cookie("usersName", username)
                    return res.send({ data: true });
                }
            })
            // return res.send({ data: true });
        }
    })


})


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




app.use(function (req, res, next) {
    console.log('Time:', Date.now())
    next()
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
