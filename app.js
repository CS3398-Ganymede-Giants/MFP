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
var baseUrl = "http://localhost:8080"



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

//getting data 
app.get('/loaddata/all/:id/:tbl', function(req, res) {
    console.log("LOADING DATA")
    // console.log(req.params.id)
    // console.log("\n\n\n\n\n\n\n")
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
        queryString = format("select * from individual_income_tbl where account_id in (select account_id from account_tbl where user_id = %L);", userId)
    }
     //sql command with cars 
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



// //loading from expense and income table
// app.get('/loadbudget/:id/:db', function(req, res) {

//     // console.log(req.params.id)
//      //need to load the data again 
//      //connecting for heroku client
//     //  herokuClient.connect()

//      //getting user id
//      var userId = req.params.userId
//      //getting db 
//      var db = req.params.db
//      //getting 

//      //for each table 
//      var queryString = ''

//      //which table 
//      //income
//      if (db == 'individual_income_tbl') {
//          //set query string 
//         queryString = 'SELECT * FROM ' + db + ' WHERE user_id = %L'
//      }
//      //expense 
//      if (db == 'individual_expense_tbl') {
//          //set query string 
//         queryString = 'SELECT * FROM ' + db + ' WHERE user_id = %L'

//      }
//      // budget 
//      if (db == 'account_tbl') {
//         queryString = 'SELECT SUM(balance) FROM account_tbl WHERE user_id = %L'
//      }


//      var dataQuery = format(queryString, userId)
//      herokuClient.query(dataQuery, function (err, result) {
//      if (err) {
//          console.log("error in stuff")
//          console.log(err)
//          // res.send({ status: 'FAILED' });
//      } else {
//     //see if user is found
//         console.log("RESULT")
//         console.log(typeof result)
//         console.log(result)
//         //if there's not 0 entries
//         if(result != undefined) {

//             if (result.rows[0] != undefined) {
//                 console.log("Data found!")
//                 res.setHeader('Content-Type', 'application/json');
//                 var jsonResponse = JSON.stringify(result.rows)
//                 //  res.send(jsonResponse);
//                 res.json(jsonResponse)
//                 res.end()
//                 // done()
//             } else {
//                 console.log("Data NOT found")
//                 res.setHeader('Content-Type', 'application/json');
//                 res.json({ data: "notfound" });
//                 // done()
//             }
//             // res.setHeader('Content-Type', 'application/json');
//             // res.json(result.rows)
//             // res.end()
//         } else {
//             console.log("NO DATA FOUND")
//             res.setHeader('Content-Type', 'application/json');
//             res.json({ data: "NOdatafound" });
//             res.end()
//                 // done()
//         }
//         // res.end()
//     }

 
//     })
// })


app.get('/loginConfirmation.html', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/html/loginConfirmation.html'));
});

app.get('/userinfo.html', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/html/userinfo.html'));
});

app.get('/contact.html', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/html/contact.html'));
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
    var email = req.query['email']

    // console.log(username)
    // console.log(passw)
    // console.log(firstName)
    // console.log(lastName)
    // console.log(email)

    const query = {
        text: "INSERT INTO user_tbl (username, passw, firstname, lastname, email_address) VALUES ($1, crypt($2, gen_salt('bf')), $3, $4, $5) RETURNING user_id",
        values: [username, passw, firstName, lastName, email]
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
            // console.log("user id is ")
            // console.log(result.rows[0].user_id)
            res.cookie("usersName", username)
            res.cookie("user_id", result.rows[0].user_id)

            //going to prepopulate the account_tbl with checking,savings,credit
            //hmm pausing on that


            res.send({ data: true });
        }
    })




})


//saving user submitted data
app.post('/saveexpense', function(req, res) {

    //getting data 
    console.log("Responding to POST")
    console.log(req.body)
    // {test: 'testval'}

    //need to grab the data from the requet 
    

    //json body 
    // var postBody = {
    //     expense_id: newItem.id,
    //     expense_type_id: type,
    //     user_id: user_id_val,
    //     description: newItem.description,
    //     cost_amount: newItem.value
    // }

    //vars 
    //db string
    var db = req.body.db 
    //storing full body 
    var body = req.body
    //values store correctly

    // select value 'inc' is +, 'exp' is -
    //need to store in the correct database 
    //query
    //query string 
    var query = {}
    var queryString = ''
    if (db == 'individual_expense_tbl') {
        //storing columns to add 
        var columns = ['expense_id', 'expense_type_id', 'user_id', 'description', 'cost_amount']
        //values array to send 
        var valArr = [body.expense_id, body.expense_type_id, body.user_id, body.description, body.cost_amount]
        //query string 
        queryString = 'INSERT INTO ' + db + ' (expense_id, expense_type_id, user_id, description, cost_amount) VALUES ($1, $2, $3, $4, $5)'
        //making full query 
        query = {
            text: queryString,
            values: valArr
        }
    } 
    if (db == 'individual_income_tbl') {
        
        //storing columns to add 
        var columns = ['income_id', 'account_id', 'description', 'income_amount', 'user_id']
        //values array to send 
        var valArr = [body.income_id, body.account_id, body.description, body.income_amount, body.user_id]
        //query string 
        queryString = 'INSERT INTO ' + db + ' (income_id, account_id, description, income_amount, user_id) VALUES ($1, $2, $3, $4, 4%)'
        //making full query 
        query = {
            text: queryString,
            values: valArr
        }
    
    }
    if (db == 'account_tbl') {
        //database to store in

        //storing columns to add 
        var columns = ['account_id', 'user_id', 'account_type', 'balance', 'balance_goal', 'monthly_payment']
        //values array to send 
        var valArr = [body.account_id, body.user_id, body.account_type, body.balance, body.balance_goal, body.monthly_payment]
        console.log("\n\n\n"+ valArr + "\n\n\n")
        //query string 
        queryString = 'UPDATE account_tbl SET balance = ' + body.balance + ' WHERE account_id = ' + body.account_id
        // queryString = 'INSERT INTO ' + db + ' (income_id, account_id, description, income_amount) VALUES ($1, $2, $3, $4)'
        //making full query 
        query = {
            text: queryString,
            // values: valArr
        }


    } 

 
    // myClient.query(ageQuery, function (err, result) {
    //     if (err) {
    //         console.log(err)
    //         // res.send({ status: 'FAILED' });
    //     }

    //adding to table
    herokuClient.query(query, function (err, result) {
        if (err) {
            console.log(err)
            res.send({ data: false });
        } else {
            console.log("\n\nno error in adding\n\n")
            // res.cookie("usersName", username)
            return res.send({ data: true });
        }
    })



    // return res.send()

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
