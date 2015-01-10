var User = require('../models/user');

module.exports = function(app, passport) {

  app.get('/', function (req, res) {
    res.render('index');
  });

  app.get('/login', function(req, res) {
    res.render('login', { message: req.flash('loginMessage') });
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/',
    failureRedirect : '/login',
    failureFlash : true
  }));

  app.get('/register', function(req, res) {
    res.render('register', { message: req.flash('registerMessage') });
  });

  app.post('/register', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/register',
    failureFlash: true
  }));

  app.get('/user/:id', getUser, function (req, res) {
    res.render('user', { user : req.params.id });
  });

  app.get('/submit', isLoggedIn, function(req, res) {
    res.render('submit');
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
};

// route middleware, make sure user is logged in
function isLoggedIn(req, res, next) {

  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}

function getUser(req, res, next) {
  User.findOne({ 'local.username' : req.params.id }, function(err, user) {
    if (!user) {

      res.status(404);

      if (req.accepts('html')) {
        res.render('404', { error: req.url });
        return;
      }

      if (req.accepts('json')) {
        res.send({ error: 'Not found' });
        return;
      }

      res.type('txt').send('Not found');
      return;
    }

    return next();
  });
}
