var mongoose = require("mongoose");

var Userschema = new mongoose.Schema({
        name: String,
        age: String
}) ;

module.exports = mongoose.model("user" , Userschema);