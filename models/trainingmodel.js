var mongoose = require("mongoose");
var Trainingschema = new mongoose.Schema({
    name: String,
    description: String,
    startDateTime: String,
    endDateTime: String,
    upload: String
}) ;

module.exports = mongoose.model("trainings" , Trainingschema);