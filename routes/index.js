var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log( 'these are my current cookies: ', req.cookies );

  if ( req.cookies.logged === undefined ){
    res.redirect('/login');
  }

  else {
    var user = {};

    fs.readFile( __dirname + '/users.json', 'utf8', function(err, data){
      user = JSON.parse( data )[req.cookies.username];
      console.log( 'here is the user im passing to the index jade template: ', user )
      res.render('index', { username: user.username, posts: user.posts } );
    });
    
  }

});

router.get('/login', function( req, res, next ){
  
  if ( req.cookies.logged ){
    res.redirect('/');
  }
  else {
    res.render('login', { error: '' } );
  }
});

router.post('/login', function(req, res, next){
  
  var username = req.body.username;
  
  fs.readFile( __dirname + '/users.json', 'utf8', function(err, data){
    data = JSON.parse(data);
    if( data[username] ){
      res.cookie( 'logged' , true );
      res.cookie( 'username', username );
      res.redirect('/');
    }
    else{
      res.render('login', { error: "don't you want to register first? how do you think this works...?" } )
    }
  }); //end readFile callback
}); //end /login post

router.post('/register', function(req, res){
  fs.readFile( __dirname + '/users.json', 'utf8', function(err, data){

    var username = req.body.username;

    var users = JSON.parse( data );

    if ( users[username] === undefined ){
      users[username]={
        username: username,
        posts: [],
        favs: []
      };
    }

    users = JSON.stringify(users);
    fs.writeFile( __dirname + '/users.json', users );

    res.cookie( 'logged' , true );
    res.cookie( 'username', username );
    res.redirect('/');
  }); //end readFile callback
});// end /register post

router.post('/logout', function(req, res, next){
  console.log( 'the logout post is being recieved!' );
  console.log( 'cookies as read from the button post: ', req.cookies ); 
  res.clearCookie('logged', {path: '/'});
  res.clearCookie('username', {path: '/'});
  //res.render('index'); //IF THIS ISN'T HERE, THE COOKIES STAY, WHY?
  /*I NEED TO RENDER A NEW PAGE AFTER DELETING THE COOKIES!*/
  //next();
}); //end /logout post

// router.get('/', function(req, res, next){
//   console.log('im  the "next" thing, running now!')
//   res.render('index');
// })

// router.post('/post', function(req, res, next){
// 
//   console.log( 'this is the request object body: ', req.body.content );
//   /*
//   var user = readFile
// 
//   var posts = user.posts // []
//   
//   var post  = {
//     content: res.data,
//     date: '',
//     favorited: true
//   }
// 
//   posts.unshift( post );
// 
//   writeFile
// 
//   render success message
//   */
// 
// });

router.post('/post', function(req, res, next){

  //console.log( 'this is the request object body: ', req.body.content );
  var users = {};
  //console.log(users);
  fs.readFile( __dirname + '/users.json', 'utf8', function(err, data){
    //console.log('read working?');
  users = JSON.parse( data );
  var user = users[req.cookies.username];
  var posts = user.posts;
  
  var post  = {
    content: req.body.content,
    date: new Date(),
    favorited: false
  };
  //console.log("post is ", post);

  posts.unshift( post );
  
  //console.log("posts is ", posts);
  
    
  users = JSON.stringify(users, null, 4);
  fs.writeFile( __dirname + '/users.json', users );
  });
});

module.exports = router;