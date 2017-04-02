var
    express      = require("express"),
    app          = express(),
    bodyParser   = require("body-parser"),
    mongoose     = require("mongoose"),
    Campground   = require("./models/campground"),
    seedDB       = require("./seeds")
;

// cleaning DB
seedDB();

mongoose.connect("mongodb://localhost/yelp_camp");

// SETUP EXPRESS
app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")


app.get("/", function(req, res){
  res.render("landing");
});

// INDEX - show all resources
app.get("/campgrounds", function(req, res){
  Campground.find({}, function(err, allCampgrounds){
    if(err) {
      console.log(err);
    } else {
      res.render("index", {
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
  res.render("new")
})

// SHOW - show ifo about specific resource
app.get("/campgrounds/:id", function(req, res){
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
    if(err){
      console.log(err);
    } else {
      res.render("show", {campground : foundCampground})
    }
  });
})

// Serwer start
app.listen(3000, function(){
  console.log("Server is running");
});
