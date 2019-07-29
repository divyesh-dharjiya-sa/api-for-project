var mongoose = require("mongoose");
var Trainingschema = new mongoose.Schema({
    name: String,
    description: String,
    startDateTime: String,
    endDateTime: String,
    upload: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
}) ;

module.exports = mongoose.model("trainings" , Trainingschema);