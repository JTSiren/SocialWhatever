//=====================================
//  Initialization
//=====================================

var express       = require( 'express' );
var cookieParser  = require( 'cookie-parser' );
var bodyParser    = require( 'body-parser' );
var url           = require( 'url' );
var fs            = require( 'fs' );
var app           = express();

app.use( express.static('public') );
app.use( bodyParser.urlencoded({ extended: false} ));

//=====================================
//  Routes
//=====================================

app.get('/', function(req, res){
  res.sendfile('public/index.html');
});


app.get('/login', function(req, res){
  res.sendfile('public/login.html');
})

app.post('/login/:user', function(req, res){
  var username  = req.params.user;
  console.log( username );
})

app.post('/login', function(req, res){
  //
});

app.get('/tweet', function(req, res){
  res.sendfile('public/tweet.html');
})

// app.post('/tweet', function(req, res){
//   req.
// })

app.get('/register', function(req, res){
    res.sendfile('public/register.html');
});

app.post('/register', function(req, res){
  
  fs.readFile('./users.json', 'utf8', function(err, data){
    
    var users = JSON.parse( data );
    
    var username = req.body.username;

    if ( users[username] === undefined ){
      users[username]={
        posts: {},
        favs: {}
      };
    }

    users = JSON.stringify(users);
    fs.writeFile('users.json', users );
  });
  
});

app.get('/search', function(req, res){

});

app.post('/search', function(req, res){
  
});

app.get('/profile', function(req, res){
  //
});

app.get('/about', function(req, res){
  
});

app.get('/favorites', function(req, res){

});



//=====================================
//  Server / Host Instructions
//=====================================

var server = app.listen(3000, function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log('Our server is running at http://%s:%s', host, port);
});