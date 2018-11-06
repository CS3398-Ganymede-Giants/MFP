// Update with your config settings.


//  development: {
//   client: 'sqlite3',
//   connection: {
//     filename: './dev.sqlite3'
//   }
// },

module.exports = {

  development: {
    client: 'postgresql',
    connection: {
        database: 'testdb'
    },
    debug: true
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};

//added
// var env = process.env.NODE_ENV || 'development';
// var config = require('../knexfile')[env];

// module.exports = require('knex')(config);