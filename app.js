var express = require('express');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;

var app = express();
var pub = __dirname + '/public';
app.use(express.static(pub));

app.set('view engine', 'jade');

if (app.get('env') === 'development') {
  app.locals.pretty = true;
}

function User(name, email) {
  this.name = name
  this.email = email
};

var users = [
  new User('bg', 'bg@bg.com'),
  new User('fc', 'fc@fc.com'),
  new User('su', 'su@su.com')
];

app.get('/', function (req, res) {
  res.render('index', { users: users })
});

var server = app.listen(3000, function() {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port)

});
