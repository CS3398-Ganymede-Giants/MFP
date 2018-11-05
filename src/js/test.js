var Client = require('pg-native')
 
var client = new Client();
client.connect(function(err) {
  if(err) throw err
 
  //text queries
  client.query('SELECT NOW() AS the_date', function(err, rows) {
    if(err) throw err
 
    console.log(rows[0].the_date) //Tue Sep 16 2014 23:42:39 GMT-0400 (EDT)
 
    //parameterized statements
    client.query('SELECT $1::text as twitter_handle', ['@briancarlson'], function(err, rows) {
      if(err) throw err
 
      console.log(rows[0].twitter_handle) //@briancarlson
    })
 
    //prepared statements
    client.prepare('get_twitter', 'SELECT $1::text as twitter_handle', 1, function(err) {
      if(err) throw err
 
      //execute the prepared, named statement
      client.execute('get_twitter', ['@briancarlson'], function(err, rows) {
        if(err) throw err
 
        console.log(rows[0].twitter_handle) //@briancarlson
 
        //execute the prepared, named statement again
        client.execute('get_twitter', ['@realcarrotfacts'], function(err, rows) {
          if(err) throw err
 
          console.log(rows[0].twitter_handle) //@realcarrotfacts
          
          client.end(function() {
            console.log('ended')
          })
        })
      })
    })
  })
})