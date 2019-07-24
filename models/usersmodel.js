var mongoose = require("mongoose");
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var Userschema = new mongoose.Schema({
        firstName: String,
        lastName: String,
        gender: String,
        email: String,
        password: String
}) ;
//password crpto
Userschema.methods.setPassword = function(password){
        this.salt = crypto.randomBytes(16).toString('hex');
        this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

Userschema.methods.validPassword = function(password) {
        var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
        return this.hash === hash;
      };

// sighnup store
Userschema.methods.generateJwt = function() {
        var expiry = new Date();
        expiry.setDate(expiry.getDate() + 7);
      
        return jwt.sign({
          _id: this._id,
          email: this.email,
          firstName: this.firstName,
          lastName: this.lastName,
          gender: this.gender,
          exp: parseInt(expiry.getTime() / 1000),
        }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
      };

module.exports = mongoose.model("user" , Userschema);