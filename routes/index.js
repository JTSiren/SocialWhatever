var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  // console.log( 'these are my current cookies: ', req.cookies );

  if ( req.cookies.logged === undefined ){
    res.redirect('/login');
  }

  else {
    var user = {};

    fs.readFile( __dirname + '/users.json', 'utf8', function(err, data){

      data = JSON.parse( data );
      var users = data.Users;
      // console.log('users obj is', users);
      user = users[req.cookies.username];
      // console.log( 'here is the user im passing to the index jade template: ', user );
      res.render('index', { username: user.username, posts: user.posts, allPosts: data.Mother } );
    });
    
  }

});


router.get('/login', function( req, res, next ){
  console.log( 'running the login route!' );
  if ( req.cookies.logged ){
    console.log( 'i think you have cookies!' );
    res.redirect('/');
  }
  else {
    console.log( 'i admit you have no cookies! ill try to render login');
    res.render('login', { error: '' } );
  }
});

router.post('/login', function(req, res, next){
  
  var username = req.body.username;
  
  fs.readFile( __dirname + '/users.json', 'utf8', function(err, data){
    data = JSON.parse(data);
    var users = data.Users;
    if( users[username] ){
      res.cookie( 'logged' , true );
      res.cookie( 'username', username );
      res.redirect('/');
    }
    else{
      res.render('login', { error: "don't you want to register first? how do you think this works...?" } );
    }
  }); //end readFile callback
}); //end /login post

router.post('/register', function(req, res){
  fs.readFile( __dirname + '/users.json', 'utf8', function(err, data){

    var username = req.body.username;

    data = JSON.parse( data );
    var users = data.Users;

    if ( users[username] === undefined ){
      users[username]={
        username: username,
        posts: [],
        favs: []
      };
    }

    data = JSON.stringify(data);
    fs.writeFile( __dirname + '/users.json', data );

    res.cookie( 'logged' , true );
    res.cookie( 'username', username );
    res.redirect('/');
  }); //end readFile callback
});// end /register post

router.get('/logout', function(req, res, next){
  console.log( 'the logout post is being recieved!' );
  console.log( 'cookies as read from the button post: ', req.cookies ); 
  res.clearCookie('logged', {path: '/'});
  res.clearCookie('username', {path: '/'});
  res.redirect('/'); //IF THIS ISN'T HERE, THE COOKIES STAY, WHY?
  /*I NEED TO RENDER A NEW PAGE AFTER DELETING THE COOKIES!*/
  //next();
}); //end /logout post


router.post('/post', function(req, res, next){


  //console.log( 'this is the request object body: ', req.body.content );
  var users = {};
  //console.log(users);
  fs.readFile( __dirname + '/users.json', 'utf8', function(err, data){
    //console.log('read working?');

  data = JSON.parse( data );
  users = data.Users;

  var user = users[req.cookies.username];
  // console.log('after parse', users)
  var posts = user.posts;

  var post  = {
    username: user.username,
    content: req.body.content,
    date: new Date(),
    favorited: false
  };

  //console.log("post is ", post);

  posts.unshift( post );
  
  //console.log("posts is ", posts);

  
  data.Mother.unshift( post );
  data = JSON.stringify(data, null, 4);
  fs.writeFile( __dirname + '/users.json', data );
    res.send();
  });
});

router.get('/refreshPosts', function( req, res, next ){
  console.log( 'Im running the refreshPosts route!' );
  
  fs.readFile( __dirname + '/users.json', 'utf8', function(err, data){
    //console.log( 'this is the refresh post readFile data: ', data);
    allPosts = JSON.parse(data).Mother;
    //console.log( 'heres what i think allPosts is: ', allPosts );
    res.send( allPosts );
  });
});

router.get('/user/:username', function(req, res, next) {
  if ( req.cookies.logged === undefined ){
    res.redirect('/login');
  }

  else {
    var user = {};

    fs.readFile( __dirname + '/users.json', 'utf8', function(err, data){

      data = JSON.parse( data );
      var users = data.Users;
      console.log('the users obj is', users);
      // user = users[req.cookies.username];
      // console.log('what is the username', req.params.username);
      user = users[req.params.username];
      console.log( 'here is the user im passing to the index jade template: ', user );
      console.log('posts are: ', user.posts);
      console.log('username is: ', user.username);
      res.render('profile', { username: user.username, posts: user.posts} );
      
    });
    
  }

});

router.get('/users', function(req, res, next) {
  if ( req.cookies.logged === undefined ){
    res.redirect('/login');
  }

  else {
    var user = {};

    fs.readFile( __dirname + '/users.json', 'utf8', function(err, data){

      data = JSON.parse( data );
      var users = data.Users;
      var names = Object.keys(users).sort();
      user = users[req.cookies.username];
      res.render('who', { users:names, username: user.username} );
      
    });    
  }
});

router.post('/search', function(req,res,next){
  var arry = [];
  console.log('i searched something');
  fs.readFile(__dirname + '/users.json', 'utf8', function(err, data){
    
    data = JSON.parse( data );
    var posts = data.Mother;
    console.log("the req body is", req.body);
    
    posts.forEach(function(elem){
      element=elem.content.toLowerCase();
      if(element.indexOf(req.body.search.toLowerCase())>=0){
        arry.push(elem);
      }      
    });
    console.log("before", arry);
    res.render('search', {array:arry});
  });
  
});


// router.get('/search', function( req, res, next ){
//   console.log("i did a search");
//   fs.readFile( __dirname + '/users.json', 'utf8', function(err, data){
//     //console.log( 'this is the refresh post readFile data: ', data);
//     allPosts = JSON.parse(data).Mother;
//     //console.log( 'heres what i think allPosts is: ', allPosts );
//     res.send( allPosts );
//   });
// });


module.exports = router;





