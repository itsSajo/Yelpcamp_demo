var
    express      = require("express"),
    app          = express(),
    bodyParser   = require("body-parser"),
    mongoose     = require("mongoose"),
    Campground   = require("./models/campground"),
    Comment      = require("./models/comment"),
    seedDB       = require("./seeds"),
    del          = require('del')
;

// cleaning DB
seedDB();

mongoose.connect("mongodb://localhost/yelp_camp");

// SETUP EXPRESS
app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")
// dirname zwraca nam sciezke, gdzie znajduje sie skrypt
app.use(express.static(__dirname + "/public"))


app.get("/", function(req, res){
  res.render("landing");
});

// INDEX - show all resources
app.get("/campgrounds", function(req, res){
  Campground.find({}, function(err, allCampgrounds){
    if(err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", {
        campgrounds : allCampgrounds
      })
    }
  })
})

// CREATE - create new resource
// logika gdzie powstaje nowy campground poprze form w campgrounds/new
app.post("/campgrounds", function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description

  var newCampground = {
    name        : name,
    image       : image,
    description : description

  };
  // obiekt przekazujemy do bazy danych
  Campground.create(newCampground, function(err, newCamp){
    if(err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds")
    }
  })
})

// NEW - show form to create resource
// strona ktora wysyla żadanie POST do /campgrounds poprzez form
app.get("/campgrounds/new", function(req, res){
  res.render("campgrounds/new")
})

// SHOW - show ifo about specific resource
app.get("/campgrounds/:id", function(req, res){
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
    if(err){
      console.log(err);
    } else {
      res.render("campgrounds/show", {campground : foundCampground})
    }
  });
})

app.get("/campgrounds/:id/comments/new", function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", {
        campground : campground
      });
    }
  });
})

app.post("/campgrounds/:id/comments", function(req, res) {
  Campground.findById(req.params.id, function(err, campground){
    if(err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, function(err, comment){
        if (err) {
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  })
});

// Serwer start
app.listen(3000, function(){
  console.log("Server is running");
});
