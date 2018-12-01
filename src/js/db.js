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

//variables
var baseUrl = "http://localhost:8080"
// var baseUrl = "https://ganymede18.herokuapp.com"

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

    const GetMain = 'http://localhost:8080/user/:id/failed'

    const Data = {name:"name1", id:123}

    const otherPram={
        headers:{
            "content-type":"application/json; charset=UTF-8"
        },
        body:Data,
        method:"POST"
    };


    fetch(GetMain)
        .then(data=>{return data})
        .then(data=>{console.log(data.json())})
        .then(res=>{console.log(res)})
}

var test = function () {

    // import axios from 'axios'


    console.log("test() called");



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

//   var login = function (username, passw) {
//     console.log("login function called.");
//   }

  function loginTest() {
      var test = login()
      console.log("ASYNC TEST IS ")
    //   console.log(test.then(alert))
      var finalReturn = test.then(value=>{console.log(value)}) //outputs true to console
      console.log(finalReturn)
  }

  async function login () {

    console.log("login function called.");

    //variables to use
    // var username = "james"
    var username = document.getElementById("loginusername").value;
    // var passwd = "1234"
    var passwd = document.getElementById("loginpassword").value;

    //getting username to search
    //NEED TO CHANGE ID
    // var userNameToSearch = document.getElementById("usernameinput").value;
    //logging usernametosearch
    // console.log(userNameToSearch)

    //storing result of search
    // var searchResult = await searchUserAsync(userNameToSearch)

    //not anything below here in the stack
    var loginResult = await loginAsync(username, passwd)

    console.log("IN ASYNC FUNCTION ")
    console.log(loginResult)

    //if wrong alert and go back to main
    if (loginResult == false) {
      alert("Wrong username/password")
      //test moving this
      window.location.href = baseUrl;
    } else {
      window.location.href = baseUrl + "/loginConfirmation.html";
    }


    //if right, go to loginConfirmation

    return loginResult
  }

  function loginAsync(username, passwd) {
    //base url to GET
    // var getMainWithQuery = 'http://localhost:8080/userlogin' 
    // var getMainWithQuery = 'https://ganymede18.herokuapp.com/userlogin'
    var getMainWithQuery = baseUrl + '/userlogin'
    console.log("ASYNC FUNCTION CALLED")

    return new Promise(resolve => {
        console.log("In promise")
        //calling the fetch
        fetch(buildUrl(getMainWithQuery, {
            username: username,
            passwd:passwd
        }), {
          mode: "same-origin"
        }).then(response =>
            response.json().then(data => ({
                data: data
            })
        ).then(res => {
            console.log("User login?")
            console.log(res.data.data)

            //storing
            searchResult = res.data.data;

            //fulfilling the promise
            resolve(searchResult)


        }));
    });
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
    // var getMainWithQuery = 'http://localhost:8080/user/:id'
    var getMainWithQuery = baseUrl + '/user/:id'
    console.log(getMainWithQuery)

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

  function logout() {
    console.log("logout function called.");
    console.log("LOGOUT CLICKED")

    //vars
    var getMainWithQuery = baseUrl + '/userlogout'

    //http reqest
      fetch(buildUrl(getMainWithQuery, {
    }),{
      mode: "same-origin"
    }).then(function() {
      window.location.href = baseUrl;
    });
  }

  // var logout = function () {
  //   console.log("logout function called.");
  //   console.log("LOGOUT CLICKED")

  //   //vars
  //   var getMainWithQuery = 'https://ganymede18.herokuapp.com/userlogout'

  //   //http reqest
  //     fetch(buildUrl(getMainWithQuery, {
  //   }),);

  // }

//   var createUser = function (username, passw, firstName, lastName) {
//     console.log("createUser function called.");
//   }

  async function createUser(firstName, lastName, username, passw, email) {
    console.log("createUser function called.");
    // console.log(passw)

    //getting result of adding user
    var didAddSuccessfully = await createUserAsync(username, passw, firstName, lastName, email)
    // createUserAsync(username, passw, firstName, lastName, email, function(didAddSuccessfully) {
      console.log("IN ASYNC FUNCTION ")
      console.log(didAddSuccessfully)
      console.log(didAddSuccessfully.data)
      console.log("BEFORE IF")
      // alert("test")

      //choosing the next page
      if (didAddSuccessfully.data == true) {
        //redirect
        console.log("IN IF")
        
        window.location.href = baseUrl + "/loginConfirmation.html";
        // alert("User added")
        
      } else {
        
        console.log("IN IF not added")
        window.location.href = baseUrl + "/loginConfirmation.html";
        // alert("User not added")
      }
      // console.log("AFTER IF")
    // })

    




  }

  function createUserAsync(username, passw, firstName, lastName, email) {
    //base url to GET
    var url = baseUrl + '/createuser'
    // var getMainWithQuery = 'https://ganymede18.herokuapp.com/createuser'

    //return promise 
    return new Promise(resolve => {
      //fetch 
      // console.log("here in promise")
      // Default options are marked with *
      fetch(buildUrl(url, {
        username:username,
        passw:passw,
        firstName:firstName,
        lastName:lastName,
        email:email
      }), {
          method: "GET", 
          mode: "same-origin",
          // mode: "cors", // no-cors, cors, *same-origin
          // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          // credentials: "same-origin", // include, *same-origin, omit
          headers: {
              "Content-Type": "application/json",
              // "Content-Type": "application/x-www-form-urlencoded",
          },
          // redirect: "follow", // manual, *follow, error
          // referrer: "no-referrer", // no-referrer, *client
          // body: postBody, // body data type must match "Content-Type" header
      }).then(response => {
          console.log("here again")
          // var responseJson = JSON.parse(response)
          console.log("RESPONSE")
          // console.log(response.json())
          // var responseJson = response.json()
          // console.log(responseJson)
          // resolve(responseJson)
          //callback
          // resolve()
          
          resolve(response.json())
          // callback && callback(response.json())
          // resolve(responseJson.result.data)
      }); // parses response to JSON
  })

   
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
    console.log("URL IS ")
    console.log(url)
    return url;
}


//LOADING ITEMS 
function loadItemsTest() {
  var response = loadItemsAsync()
}


async function loadItemsAsync() {

  console.log("load async")
  //javascript await 
  var response = await loadItems();
  return response;
}


//Loading function
function loadItems() {
  //GET req to node server to grab data from individual_expense_tbl to populate table etc with 
console.log("in load items")

  //teseting response 
  var testJson = {test:"data"}
  return testJson

  // //vars 
  // var baseUrl = "http://localhost:8080"
  // //user id from cookies 
  // var user_id_val = getCookie("user_id")

  // //need to make a GET and return json 
  // //url from base 
  // var url = baseUrl + '/user/:id/data'
  // console.log("url is ")
  // console.log(url)

  // //request body
  // var postBody = {
  //     user_id: user_id_val
  // }

  // //fetch 
  // // Default options are marked with *
  // fetch(url, {
  //     method: "POST", 
  //     mode: "same-origin",
  //     // mode: "cors", // no-cors, cors, *same-origin
  //     // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
  //     // credentials: "same-origin", // include, *same-origin, omit
  //     headers: {
  //         "Content-Type": "application/json",
  //         // "Content-Type": "application/x-www-form-urlencoded",
  //     },
  //     // redirect: "follow", // manual, *follow, error
  //     // referrer: "no-referrer", // no-referrer, *client
  //     body: postBody, // body data type must match "Content-Type" header
  // })
  // .then(response => function() {

  //     console.log("RESPONSE")
  //     console.log(response.json())
  //     return response.json()
  // }); // parses response to JSON


//delete 
/*UICntrl.displayBudget({
  budget: 0,
  totalInc: 0,
  totalExp: 0,
  percentage: -1
});*/

}



function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}





/*
  async function createItem() {
    console.log("createItem function called.");



    //variables are
    // var itemType = "+"
    var itemType = document.getElementById("createitemtype").value;
    // var itemDescription = "income"
    var itemDescription = document.getElementById("createitemdescription").value;
    // var itemValue = "1200"
    var itemValue = document.getElementById("createitemvalue").value;


    var didAddItemSuccessfully = await createItemAsync(itemType, itemDescription, itemValue)

    console.log("IN ASYNC FUNCTION ")
    console.log(didAddItemSuccessfully)

    //choosing
    if (didAddItemSuccessfully == true) {
    window.location.href = "https://ganymede18.herokuapp.com/trackingPage.html";
      alert("Item added")
    } else {
      alert("Item not added")
    }




  }

  */

/*
  function createItemAsync(itemType, itemDescription, itemValue) {
    //base url to GET

    var getMainWithQuery = 'https://ganymede18.herokuapp.com/createItem'

    return new Promise(resolve => {
        //calling the fetch
        fetch(buildUrl(getMainWithQuery, {
            itemType:expense_type_id,
            itemDescription:description,
            itemValue:cost_amount
        }),).then(response =>
            response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            console.log("Item added?")
            console.log(res.data.data)

            //storing
            searchResult = res.data.data;

            //fulfilling the promise
            resolve(searchResult)


        }));
    });
  }
  */


















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























/*
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


  */
