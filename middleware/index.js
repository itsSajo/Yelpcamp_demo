var Campground = require("../models/campground");
var Comment = require("../models/comment");

// ALL CUSTOM MIDDLEWARE HERE

var middlewareObject = {

  isLoggedIn : function(req, res, next) {
    if(req.isAuthenticated()){
      return next();
    }
    req.flash("error", "You need to logged in to do that!");
    res.redirect("/login");
  },

  isCampgroundAuthor : function(req, res, next) {
    if(req.isAuthenticated()) {
      Campground.findById(req.params.id, function(err, foundCampground){
        if(err) {
          req.flash("error", "Campground not found");
          res.redirect("back")
        } else {
          // porownuje obiekt id z string id
          //if (foundCampground.author.username === req.user.username)
          if(foundCampground.author.id.equals(req.user._id)) {
            next();
          } else {
            req.flash("error", "Permission denied!");
            res.redirect("back")
          }
        }
      });
    } else {
      req.flash("error", "You need to be logged in to do that!")
    // redirect to previous back
      res.redirect("back");
    }
  },

  isCommentAuthor  : function(req, res, next) {
    if(req.isAuthenticated()) {
      Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err) {
          req.flash("error", "Comment not found");
          res.redirect("back")
        } else {
          // porownuje obiekt id z string id
          //if (foundCampground.author.username === req.user.username)
          if(foundComment.author.id.equals(req.user._id)) {
            next();
          } else {
            req.flash("error", "Permission denied!");
            res.redirect("back")
          }
        }
      });
    } else {
      req.flash("error", "You need to logged in to do that!");
    // redirect to previous back
      res.redirect("back");
    }
  },

}

module.exports = middlewareObject
