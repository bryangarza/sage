var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./models/users');

var connStr = 'mongodb://localhost/sage-devel';
mongoose.connect(connStr, function(err) {
  if (err) throw err;
  console.log('Connected to %s', connStr);
});
var db = mongoose.connection;

var app = express();
var pub = __dirname + '/public';
app.use(express.static(pub));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'jade');

if (app.get('env') === 'development') {
  app.locals.pretty = true;
}

app.get('/', function (req, res) {
  res.render('index');
});

app.post('/register', function (req, res) {
  console.log(req.body.register.email);
  console.log(req.body.register.password);
  console.log(req.body.register.username);
});

var server = app.listen(3000, function() {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port)

});
