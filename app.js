var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');
var pub      = __dirname + '/public';

mongoose.connect(configDB.url, function(err) {
  if (err) throw err;
  console.log('Connected to %s', configDB.url);
});

require('./config/passport')(passport);

app.use(express.static(pub));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'jade');
if (app.get('env') === 'development') {
  app.locals.pretty = true;
}

// required for passport
app.use(session({
  secret: 'pizzasandcoffeeandlispandmorepizza',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());

// load routes and pass app and fully configured passport
require('./routes/routes.js')(app, passport);

var server = app.listen(port, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Listening at http://%s:%s', host, port);
});
