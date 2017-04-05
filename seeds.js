// czyszczenie  i dodawanie sampli do db, niz ciagle reczne jego wstawianie poprzez create() save()
var moongose     = require("mongoose");
var Campground   = require("./models/campground");
var Comment      = require("./models/comment");


var data = [
  {
    name        : "Test Camp ",
    image       : "https://farm6.staticflickr.com/5786/20607281024_5c7b3635cc.jpg",
    description : "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  {
    name        : "Test Camp 2",
    image       : "https://farm6.staticflickr.com/5694/21041875770_ffea6404d0.jpg",
    description : "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  {
    name        : "Test Camp 3",
    image       : "https://farm7.staticflickr.com/6082/6142484013_74e3f473b9.jpg",
    description : "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod "
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
        });
     });
   });
}

module.exports = seedDB;
