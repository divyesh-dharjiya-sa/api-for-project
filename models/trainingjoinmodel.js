var mongoose = require("mongoose");
var TrainingJoinchema = new mongoose.Schema({
   status: Boolean
}) ;

module.exports = mongoose.model("trainingJoin" , TrainingJoinchema);