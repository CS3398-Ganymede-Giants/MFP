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

  
  async function createUser(firstName, lastName, username, passw, email) {
    console.log("createUser function called.");
    // console.log(passw)

    //getting result of adding user
    var didAddSuccessfully = await createUserAsync(username, passw, firstName, lastName, email)
    // createUserAsync(username, passw, firstName, lastName, email, function(didAddSuccessfully) {


      //choosing the next page
      if (didAddSuccessfully.data == true) {
        //redirect
        // console.log("IN IF")
        window.alert("User added!")
        window.location.href = baseUrl + "/loginConfirmation.html";
        // alert("User added")
        
      } else {
        
        //user not added
        window.alert("User NOT added!")

      }

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
          //resolving promise with data
          resolve(response.json())
          
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


}



function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}
















