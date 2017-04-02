var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
  text    : String,
  authour : String
})

module.exports = mongoose.model("Comment", commentSchema);
