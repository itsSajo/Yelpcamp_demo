// czyszczenie  i dodawanie sampli do db, niz ciagle reczne jego wstawianie poprzez create() save()
var moongose     = require("mongoose");
var Campground   = require("./models/campground");
var Comment      = require("./models/comment");


var data = [
  {
    name        : "Test Camp ",
    image       : "https://farm6.staticflickr.com/5786/20607281024_5c7b3635cc.jpg",
    description : "bla bla bla"
  },
  {
    name        : "Test Camp 2",
    image       : "https://farm6.staticflickr.com/5694/21041875770_ffea6404d0.jpg",
    description : "bla bla bla"
  },
  {
    name        : "Test Camp 3",
    image       : "https://farm7.staticflickr.com/6082/6142484013_74e3f473b9.jpg",
    description : "bla bla bla"
  }
]

function seedDB() {
  Campground.remove({}, function(err){
    if(err){
      console.log(err);
    }
    console.log("removed campgrounds!");
    data.forEach(function(seed) {
      Campground.create(seed, function(err, data){
        if(err) {
          console.log(err);
        } else {
          console.log("added a campground");
          Comment.create({
            text   : "Great place!",
            author : "Homer"
          }, function(err, comment) {
            if (err) {
              console.log(err);
            } else {
              data.comments.push(comment)
              data.save();
              console.log("Created new comment!");
            }
          });
        }
      })
    });
  });

}

module.exports = seedDB;
