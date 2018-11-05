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

function login(username, passw) {
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

function searchUser(username) {
  const { Client } = require('pg');

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });

  client.connect();

  client.query('SELECT username FROM user_tbl WHERE username = $1', username)
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

function createUser(username, passw, firstName, lastName) {
  if (searchUser(username)) {
    const { Client } = require('pg');

    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: true,
    });

    client.connect();

    client.query('INSERT INTO user_tbl VALUES ($1, $2, $3, $4) RETURNING user_id', username, passw, firstName, lastName)
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
  return false;
}
