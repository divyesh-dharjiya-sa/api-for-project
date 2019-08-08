var mongoose = require("mongoose");
var TrainingJoinschema = new mongoose.Schema({
   trainingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "trainings",
      required: true
  },
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
  },
   attendQuery: Boolean
}) ;

module.exports = mongoose.model("trainingJoin" , TrainingJoinschema);