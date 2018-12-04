
// (function(){
//   var app = angular.module('blogApp',[]);




//   app.controller('PostController', function(){
//     this.posts = {};
//     this.addPost = function(post){
//       this.posts.createdOn = Date.now();
//       post.posts.push(this.posts);
//       this.posts ={};
//     };
//   });

// })();

// var baseUrl = "http://localhost:8080"
var baseUrl = "https://ganymede18.herokuapp.com"


async function saveNewPost() {
  //need to get post data 
  //also cookie 
  //vars
  var postText = document.getElementById("addPostTextArea").value;
  var user_id = getCookie("user_id")

  //need to save to user_posts_tbl
  var didAdd = await saveNewPostAsync(postText, user_id)

  //if didAdd 
  //update UI
  console.log("DID ADD")
  console.log(didAdd.didAdd)
  console.log(didAdd.data)
  if (didAdd.didAdd == true) {
    updateUI(postText, user_id, didAdd.data[0].timestamp)
    //clear text box 
    document.getElementById("addPostTextArea").value =''
  }

}

function updateUI(postText, user_id, timestamp) {
  //create new element for each one 
  // Get the element you want to add your new element before or after
  var target = document.getElementById("postsGoHere")
  // Create the new element
  // This can be any valid HTML element: p, article, span, etc...
  var div = document.createElement('div');

  //var date 
  var date = new Date(timestamp)
  date = date.toLocaleDateString("en-US");

  // Add content to the new element
  div.innerHTML = '<div class="addedPostDiv"><h2 class="addedPostDivDate">' + date + '</h2><h1 class="addedPostDivText">' + postText + '</h1></div>';

  // You could also add classes, IDs, and so on
  // div is a fully manipulatable DOM Node

  // Insert the element before our target element
  target.parentNode.insertBefore(div, target);

  // Insert the element after our target element
  target.parentNode.insertBefore(div, target.nextSibling);
}

function saveNewPostAsync(postText, user_id) {
  console.log("SAVE NEW POST")
  //fetch 
  //POST
  var postBody = {
    postText: postText,
    user_id: user_id
  }

  //url 
  var url = baseUrl + "/saveposts"

  //fetch query 
  // Default options are marked with *
  // Default options are marked with *
  return fetch(url, {
    method: "POST",
    // mode: "cors", // no-cors, cors, *same-origin
    // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      // "Content-Type": "application/x-www-form-urlencoded",
    },
    // redirect: "follow", // manual, *follow, error
    // referrer: "no-referrer", // no-referrer, *client
    body: JSON.stringify(postBody), // body data type must match "Content-Type" header
  })
    .then(response => response.json()); // parses response to JSON
}


async function loadPosts() {
  //post objs 
  // var postObjs = [{ user_id: 202, post_text: "Feeling good" }, { user_id: 202, post_text: "Feeling better" }]
  var postObjs = await loadPostsAsync()
  
  postObjs = JSON.parse(postObjs)
  console.log("LOAD POSTS ASYNC")
  console.log(postObjs)

  if (postObjs.didLoad == true && postObjs.data.length != 0) {
    //create new element for each one 
    console.log("should be loading the posts")
    // Get the element you want to add your new element before or after
    var target = document.getElementById("postsGoHere")

    //for each one 
    for (let p of postObjs.data) {
      // Create the new element
      // This can be any valid HTML element: p, article, span, etc...
      var div = document.createElement('div');

      //var date 
      var date = new Date(p.timestamp)
      date = date.toLocaleDateString("en-US");

      // Add content to the new element
      div.innerHTML = '<div class="addedPostDiv"><h2 class="addedPostDivDate">' + date + '</h2><h1 class="addedPostDivText">' + p.post_text + '</h1></div>';

      // You could also add classes, IDs, and so on
      // div is a fully manipulatable DOM Node

      // Insert the element before our target element
      target.parentNode.insertBefore(div, target);

      // Insert the element after our target element
      target.parentNode.insertBefore(div, target.nextSibling);
    }
  }

  


}

function loadPostsAsync() {
  //GET 
  //'/loadUserPosts'
  // var user_id = getCookie('user_id')

  //fetch 
  //user id from cookies 
  var user_id = getCookie("user_id")

  //need to make a GET and return json 
  //url from base 
  var url = baseUrl + '/loadUserPosts/' + user_id
  // console.log("URL IS ")
  console.log(url)


  //return promise 
  return new Promise(resolve => {
    //fetch 
    // Default options are marked with *
    fetch(url, {
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
    })
      .then(response => {
        //parsing response
        //resolving
        resolve(response.json())
      }); // parses response to JSON
  })
}


function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}



// angular.module('controllerAsExample', [])
//   .controller('SettingsController1', SettingsController1);

// function SettingsController1() {
//   this.name = 'John Smith';
//   this.contacts = [
//     { type: 'phone', value: '408 555 1212' },
//     { type: 'email', value: 'john.smith@example.org' }
//   ];
// }

// SettingsController1.prototype.greet = function () {
//   alert(this.name);
// };

// SettingsController1.prototype.addContact = function () {
//   this.contacts.push({ type: 'email', value: 'yourname@example.org' });
// };

// SettingsController1.prototype.removeContact = function (contactToRemove) {
//   var index = this.contacts.indexOf(contactToRemove);
//   this.contacts.splice(index, 1);
// };

// SettingsController1.prototype.clearContact = function (contact) {
//   contact.type = 'phone';
//   contact.value = '';
// };

