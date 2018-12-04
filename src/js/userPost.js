
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


function saveNewPost() {

}

function loadPosts() {
  //post objs 
  var postObjs = [{ user_id: 202, post_text: "Feeling good" }, { user_id: 202, post_text: "Feeling better" }]

  //create new element for each one 
  // Get the element you want to add your new element before or after
  var target = document.getElementById("postsGoHere")

  

  //for each one 
  for(let p of postObjs) {
    // Create the new element
    // This can be any valid HTML element: p, article, span, etc...
    var div = document.createElement('div');
    
    // Add content to the new element
    div.innerHTML = '<h1>' + p.post_text + '</h1>';

    // You could also add classes, IDs, and so on
    // div is a fully manipulatable DOM Node

    // Insert the element before our target element
    target.parentNode.insertBefore(div, target);

    // Insert the element after our target element
    target.parentNode.insertBefore(div, target.nextSibling);
  }

  

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

