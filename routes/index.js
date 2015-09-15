var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('============================\nthe router is working as expected!\n============================');
  console.log( 'this is the request cookie: ', req.cookie );
  
  if ( req.cookies.logged === undefined ){
    res.redirect('/login');
  }
  
  res.render('index', { title: 'Express' });

});

router.get('/login', function( req, res, next ){
  res.render('login');
});

router.post('/login', function(req, res, next){
  //give you a cookie of logged
  //reroute to index
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
  });

  res.cookie( 'logged' , true );
  res.redirect('/');
  
});

module.exports = router;
