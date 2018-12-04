
(function(){
  var app = angular.module('userPost',[]);



  app.controller('PostController', function(){
    this.posts = {};
    this.addPost = function(post){
      this.posts.createdOn = Date.now();
      post.posts.push(this.posts);
      this.posts ={};
    };
  });

})();
