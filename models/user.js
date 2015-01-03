var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var SALT_WORK_FACTOR = 10; // default

var userSchema = new Schema({

  local         : {
    email       : String,
    password    : String,
    username    : String
  },
  facebook      : {
    id          : String,
    token       : String,
    email       : String,
    name        : String
  },
  twitter       : {
    id          : String,
    token       : String,
    displayName : String,
    username    : String
  },
  github        : {
    id          : String,
    token       : String,
    displayName : String,
    username    : String,
    profileUrl  : String,
    emails      : String
  }

});

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(SALT_WORK_FACTOR), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
