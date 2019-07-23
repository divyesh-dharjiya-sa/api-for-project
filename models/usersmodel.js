var mongoose = require("mongoose");

var Userschema = new mongoose.Schema({
        firstName: String,
        lastName: String,
        gender: String,
        email: String,
        password: String
}) ;

module.exports = mongoose.model("user" , Userschema);