// Database connectivity

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
  const { Client } = require('pg');

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });

  client.connect();

  client.query('SELECT user_id FROM user_tbl WHERE username = $1 AND passw = $2', username, passw)
    .then(res => {
      if (res) {
        client.end();
        return true;
      } else {
        client.end();
        return false;
      }
    })
    .catch(e => console.error(e.stack));

  client.end();
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
