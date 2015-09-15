var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('============================\nthe router is working as expected!\n============================');
  console.log( 'this is the request cookie: ', req.cookies );
  
  var user = {};

  fs.readFile( __dirname + '/users.json', 'utf8', function(err, data){
    console.log( 'Im running the readFile function');
    console.log( 'data: ', data);
    user = JSON.parse( data )//[req.cookies.username];
    console.log( "here's what i think the user is: ", user );
  });

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
    console.log( 'this is what i think the data is: ', data)
    data = JSON.parse(data);
    console.log( 'this is the parsed data: ', data );
    console.log( 'this is the property at ' + username, data[username] )
    if( data[username] ){
      res.cookie( 'logged' , true );
      res.cookie( 'username', username );
      res.redirect('/');
    }
    else{
      res.render('login', { error: "don't you want to register first? you crazy!" } )
    }
  
  });
  
});

router.post('/register', function(req, res){
  //console.log('fs good? ', typeof fs)
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
  });
});

router.post('logout', function(res, req, next){
  req.cookies.clear;
  res.redirect('/login');
})

module.exports = router;




