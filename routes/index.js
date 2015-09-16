var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log( 'these are my current cookies: ', req.cookies );
  // var user = {};

  // fs.readFile( __dirname + '/users.json', 'utf8', function(err, data){
  //   user = JSON.parse( data )//[req.cookies.username];
  // });

  if ( req.cookies.logged === undefined ){
    res.redirect('/login');
  }
  else {
    res.render('index', { title: 'Express' });
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
        posts: {},
        favs: {},
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
  res.render('index'); //IF THIS ISN'T HERE, THE COOKIES STAY, WHY?
  /*I NEED TO RENDER A NEW PAGE AFTER DELETING THE COOKIES!*/
}); //end /logout post


module.exports = router;




