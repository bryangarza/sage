var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

module.exports = function(passport) {

  // for persistent login sessions
  // passport needs to serialize/deserialize users out of session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire req to the cb
  },
  function(req, email, password, done) {

    // async
    // User.findOne won't fire unless data is sent back
    process.nextTick(function() {
      User.findOne({ 'local.email' : email }, function(err, user) {
        if (err)
          return done(err);

        if (user) {
          return done(null, false, req.flash('registerMessage',
                   'That email is already taken.'));
            console.log('not saving because user already exists');
        } else {
          // no user with that email
          var newUser            = new User();

          newUser.local.email    = email;
          newUser.local.password = newUser.generateHash(password);
          newUser.local.username = req.body.username;

          // save the user
          newUser.save(function(err) {
            console.log('saving user');
            if (err)
              throw err;
            return done(null, newUser);
          });
        }

      });

    });

  }));

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done) {
    User.findOne({ 'local.email' : email }, function(err, user) {
      if (err)
        return done(err);

      if(!user)
        return done(null, false, req.flash('loginMessage', 'No user found.'));

      if (!user.validPassword(password))
        return done(null, false, req.flash('loginMessage', 'Wrong password.'));

      // if all is ok
      return done(null, user);
    });
  }));

};
