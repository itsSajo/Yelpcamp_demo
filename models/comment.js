var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
  text    : String,
  author  : {
    id       : {
      // referencja do modelu user poprzez typ id obiektu
      type : mongoose.Schema.Types.ObjectId,
      ref  : "User"
    },
    username : String
  }
})

module.exports = mongoose.model("Comment", commentSchema);
