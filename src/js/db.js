// Database connectivity


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

var test = function () {
    console.log("test() called");
    //database code 
    const { Client } = require('pg');

    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: true,
    });

    client.connect();

    client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
      if (err) throw err;
      for (let row of res.rows) {
        // console.log(JSON.stringify(row));
      }
      console.log("CONNECTION SUCEEDED");
      client.end();
    });
}

var connect = function () {
    const { Client } = require('pg');
  
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: true,
    });
  
    client.connect();
  
    client.query('SELECT table_schema, table_name FROM information_schema.tables;', (err, res) => {
      if (err) throw err;
      for (let row of res.rows) {
        console.log(JSON.stringify(row));
      }
      client.end();
    });
  }
  
  var login = function (username, passw) {
    console.log("login function called.");
  }
  
  var searchUser = function (username) {
    console.log("searchUser function called.");
  }
  
  var logout = function (username) {
    console.log("logout function called.");
  }
  
  var createUser = function (username, passw, firstName, lastName) {
    console.log("createUser function called.");
  }
  