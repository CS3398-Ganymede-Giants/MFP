// Database connectivity
// const { Client } = require('pg');
// import axios from 'axios'

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

var test2 = function() {
    console.log("test() called");

    // fetch('http://localhost:8080//user/:id')
    //     .then(function(response) {
    //         console.log(response);
    //     return response.json();
    //     })
    //     .then(function(myJson) {
    //     console.log(JSON.stringify(myJson));
    //     });

    const Get = 'http://localhost:8080/get.json'
    const GetMain = 'http://localhost:8080/user/:id/failed'

    const Post = 'http://localhost:8080/post.json'

    const Data = {name:"name1", id:123}

    const otherPram={
        headers:{
            "content-type":"application/json; charset=UTF-8"
        },
        body:Data,
        method:"POST"
    };

    // fetch(GetMain) // Call the fetch function passing the url of the API as a parameter
    //     .then(function(res) {
    //         // Your code for handling the data you get from the API
    //         console.log("Fetch succeeded")
    //         console.log(res.json());
    //     })
    //     .catch(function() {
    //         // This is where you run code if the server returns any errors
    //         console.log("Fetch did not succeed")
    //     });
    fetch(GetMain)
        .then(data=>{return data})
        .then(data=>{console.log(data.json())})
        .then(res=>{console.log(res)})
}

var test = function () {

    // import axios from 'axios'
    

    console.log("test() called");

    // fetch('http://localhost:8080//user/:id')
    //     .then(function(response) {
    //         console.log(response);
    //     return response.json();
    //     })
    //     .then(function(myJson) {
    //     console.log(JSON.stringify(myJson));
    //     });

    var userNameToSearch = document.getElementById("usernameinput").value;
    console.log(userNameToSearch)

    // const Get = 'http://localhost:8080/get.json'
    const GetMain = 'http://localhost:8080/user/:id/?x=2&y=3'

    //base url
    var getMainWithQuery = 'http://localhost:8080/user/:id'

    // const Post = 'http://localhost:8080/post.json'

    const Data = {name:userNameToSearch}

    const otherPram={
        headers:{
            "content-type":"application/json; charset=UTF-8"
        },
        body:Data,
        method:"GET"
    };

    // fetch(GetMain) // Call the fetch function passing the url of the API as a parameter
    //     .then(function(res) {
    //         // Your code for handling the data you get from the API
    //         console.log("Fetch succeeded")
    //         console.log(res.json());
    //     })
    //     .catch(function() {
    //         // This is where you run code if the server returns any errors
    //         console.log("Fetch did not succeed")
    //     });

    // fetch(GetMain)
    //     .then(data=>{return data})
    //     .then(data=>{console.log(data.json())})
    //     .then(res=>{console.log(res)})

    //processing url?



    fetch(buildUrl(getMainWithQuery, {
        username: userNameToSearch
    }),)
        .then(function(response) {
            console.log(response.json())
            return response;
        })
        .then(function(myJson) {
            console.log(JSON.stringify(myJson));
        });

    // fetch(GetMain)
    //     .then(function(response) {
    //       console.log(response)
    //       console.log(response.json())
    //       return response.json();
    //     })
    //     .then(function(myJson) {
    //       console.log(JSON.stringify(myJson));
    //       return response.json()
    //     });

    // fetch(Url, otherPram)
    // .then(data=>{return data.json()})
    // .then(res=>{console.log(res)})
    // .catch(error=>console.log(error))

//     axios.get('/user?ID=12345')
//   .then(function (response) {
//     console.log(response);
//   })
//   .catch(function (error) {
//     console.log(error);
//   });
    
    // //database code 
    // const { Client } = require('pg');


    // require(['pg'], function (pg) {
    //     //foo is now loaded.

    //     // const {Client} = 
    //     // console.log("test() called again after loading");

    //     // const client = new Client({
    //     // connectionString: process.env.DATABASE_URL,
    //     // ssl: true,
    //     // });
    // });

    // define(function (require) {
    //     const { Client } = require('pg');

    //     // const client = new Client({
    // //   connectionString: process.env.DATABASE_URL,
    // //   ssl: true,
    // // });

    // // client.connect();

    // // client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
    // //   if (err) throw err;
    // //   for (let row of res.rows) {
    // //     // console.log(JSON.stringify(row));
    // //   }
    // //   console.log("CONNECTION SUCEEDED");
    // //   client.end();
    // // });

    //     console.log("In define")
    // });

    // const client = new Client({
    //   connectionString: process.env.DATABASE_URL,
    //   ssl: true,
    // });

    // client.connect();

    // client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
    //   if (err) throw err;
    //   for (let row of res.rows) {
    //     // console.log(JSON.stringify(row));
    //   }
    //   console.log("CONNECTION SUCEEDED");
    //   client.end();
    // });
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
  
  async function searchUser () {
    console.log("searchUser function called.");

    //getting username to search
    //NEED TO CHANGE ID
    var userNameToSearch = document.getElementById("usernameinput").value;
    //logging usernametosearch
    console.log(userNameToSearch)

    //storing result of search 
    var searchResult = await searchUserAsync(userNameToSearch)

    console.log("IN OTHER FUNCTION ")
    console.log(searchResult)
    
    
  }

  function searchUserAsync (userNameToSearch) {

    //base url to GET
    var getMainWithQuery = 'http://localhost:8080/user/:id'

    return new Promise(resolve => {
        //calling the fetch
        fetch(buildUrl(getMainWithQuery, {
            username: userNameToSearch
        }),).then(response => 
            response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            console.log("User found?")
            console.log(res.data.data)

            //storing 
            searchResult = res.data.data;

            //fulfilling the promise
            resolve(searchResult)

        
        }));
    });

   

  }
  
  var logout = function (username) {
    console.log("logout function called.");
  }
  
//   var createUser = function (username, passw, firstName, lastName) {
//     console.log("createUser function called.");
//   }

  async function createUser() {
    console.log("searchUser function called.");

    
    //variables are 
    var username = ""
    var passw = ""
    var firstName = ""
    var lastName = ""

    //getting element from ID from DOM
    // var userNameToSearch = document.getElementById("usernameinput").value;
    // //logging usernametosearch
    // console.log(userNameToSearch)

    // //storing result of search 
    // var searchResult = await searchUserAsync(userNameToSearch)

    var didAddSuccessfully = await createUserAsync(username, passw, firstName, lastName)

    console.log("IN ASYNC FUNCTION ")
    console.log(didAddSuccessfully)
  }

  function createUserAsync(username, passw, firstName, lastName) {

  }
  

  function buildUrl(url, parameters) {
    let qs = "";
    for (const key in parameters) {
        if (parameters.hasOwnProperty(key)) {
            const value = parameters[key];
            qs +=
                encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
        }
    }
    if (qs.length > 0) {
        qs = qs.substring(0, qs.length - 1); //chop off last "&"
        url = url + "?" + qs;
    }

    return url;
}


















/*

var test = function () {

    // import axios from 'axios'
    

    console.log("test() called");

    // fetch('http://localhost:8080//user/:id')
    //     .then(function(response) {
    //         console.log(response);
    //     return response.json();
    //     })
    //     .then(function(myJson) {
    //     console.log(JSON.stringify(myJson));
    //     });

    var userNameToSearch = document.getElementById("usernameinput").value;
    console.log(userNameToSearch)

    // const Get = 'http://localhost:8080/get.json'
    const GetMain = 'http://localhost:8080/user/:id/?x=2&y=3'

    //base url
    var getMainWithQuery = 'http://localhost:8080/user/:id'

    // const Post = 'http://localhost:8080/post.json'

    const Data = {name:userNameToSearch}

    const otherPram={
        headers:{
            "content-type":"application/json; charset=UTF-8"
        },
        body:Data,
        method:"GET"
    };

    // fetch(GetMain) // Call the fetch function passing the url of the API as a parameter
    //     .then(function(res) {
    //         // Your code for handling the data you get from the API
    //         console.log("Fetch succeeded")
    //         console.log(res.json());
    //     })
    //     .catch(function() {
    //         // This is where you run code if the server returns any errors
    //         console.log("Fetch did not succeed")
    //     });

    // fetch(GetMain)
    //     .then(data=>{return data})
    //     .then(data=>{console.log(data.json())})
    //     .then(res=>{console.log(res)})

    //processing url?



    fetch(buildUrl(getMainWithQuery, {
        username: userNameToSearch
    }),)
        .then(function(response) {
            console.log(response.json())
            return response;
        })
        .then(function(myJson) {
            console.log(JSON.stringify(myJson));
        });

    // fetch(GetMain)
    //     .then(function(response) {
    //       console.log(response)
    //       console.log(response.json())
    //       return response.json();
    //     })
    //     .then(function(myJson) {
    //       console.log(JSON.stringify(myJson));
    //       return response.json()
    //     });

    // fetch(Url, otherPram)
    // .then(data=>{return data.json()})
    // .then(res=>{console.log(res)})
    // .catch(error=>console.log(error))

//     axios.get('/user?ID=12345')
//   .then(function (response) {
//     console.log(response);
//   })
//   .catch(function (error) {
//     console.log(error);
//   });
    
    // //database code 
    // const { Client } = require('pg');


    // require(['pg'], function (pg) {
    //     //foo is now loaded.

    //     // const {Client} = 
    //     // console.log("test() called again after loading");

    //     // const client = new Client({
    //     // connectionString: process.env.DATABASE_URL,
    //     // ssl: true,
    //     // });
    // });

    // define(function (require) {
    //     const { Client } = require('pg');

    //     // const client = new Client({
    // //   connectionString: process.env.DATABASE_URL,
    // //   ssl: true,
    // // });

    // // client.connect();

    // // client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
    // //   if (err) throw err;
    // //   for (let row of res.rows) {
    // //     // console.log(JSON.stringify(row));
    // //   }
    // //   console.log("CONNECTION SUCEEDED");
    // //   client.end();
    // // });

    //     console.log("In define")
    // });

    // const client = new Client({
    //   connectionString: process.env.DATABASE_URL,
    //   ssl: true,
    // });

    // client.connect();

    // client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
    //   if (err) throw err;
    //   for (let row of res.rows) {
    //     // console.log(JSON.stringify(row));
    //   }
    //   console.log("CONNECTION SUCEEDED");
    //   client.end();
    // });
}

*/