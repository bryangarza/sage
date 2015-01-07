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

  // app.get('/user/:id', function (req, res) {
  //   res.render('user', {
  //     user: id
  //   });
  // });

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
