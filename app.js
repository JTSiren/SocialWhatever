//=====================================
//  Initialization
//=====================================

var express = require('express');
var app = express();



//=====================================
//  Routes
//=====================================

app.get('/', function(req, res){
  res.sendfile('public/index.html');
});

app.post('/login', function(req, res){
  //
});

app.get('/register', function(req, res){

});

app.post('/register', function(req, res){
  
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