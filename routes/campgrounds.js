var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
// adding routes to the router

// INDEX - show all resources
router.get("/campgrounds", function(req, res){
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
router.post("/campgrounds", isLoggedIn, function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description

  var author = {
    id         : req.user._id,
    username   : req.user.username
  }

  var newCampground = {
    name        : name,
    image       : image,
    description : description,
    author      : author

  };
  // obiekt przekazujemy do bazy danych
  Campground.create(newCampground, function(err, newCamp){
    if(err) {
      console.log(err);
    } else {
      console.log(newCamp);
      res.redirect("/campgrounds")
    }
  })
})

// NEW - show form to create resource
// strona ktora wysyla żadanie POST do /campgrounds poprzez form
router.get("/campgrounds/new", isLoggedIn, function(req, res){
  res.render("campgrounds/new");
})

// SHOW - show ifo about specific resource
router.get("/campgrounds/:id", function(req, res){
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
    if(err){
      console.log(err);
    } else {
      res.render("campgrounds/show", {campground : foundCampground})
    }
  });
});

router.get("/campgrounds/:id/edit", function(req, res){
  Campground.findById(req.params.id, function(err, foundCampground){
    if(err) {
      console.log(err);
      res.redirect("/campgrounds")
    } else {
      res.render("campgrounds/edit", {
        campground : foundCampground
      });
    }
  })
})

router.put("/campgrounds/:id", function(req, res){
  // find and update the correct campground
  // redirect
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  })
})

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
