var express    = require("express");
var router     = express.Router({ mergeParams : true });
var Campground = require("../models/campground");
var Comment    = require("../models/comment");
var middleware = require("../middleware");

// id cant make through comments module
// to fix we need to pass mrgeParams to Router
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res){
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

router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground){
    if(err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      // creating coment from body context
      Comment.create(req.body.comment, function(err, comment){
        if (err) {
          console.log(err);
        } else {
          // add username and id to comment and save comment in db
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment);
          // save comment
          campground.save();
          console.log(campground);
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  })
});

router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.isCommentAuthor, function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if(err) {
      res.redirect("back");
    } else {
      // we already have id of campgorund in req.params.id
      res.render("comments/edit", {
        campground_id    : req.params.id,
        comment          : foundComment
      })
    }
  })
})

router.put("/campgrounds/:id/comments/:comment_id", middleware.isCommentAuthor, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if (err) {
      res.redirect("back")
    } else {
      console.log();
      res.redirect("/campgrounds/" + req.params.id)
    }
  })
})

router.delete("/campgrounds/:id/comments/:comment_id", middleware.isCommentAuthor, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if (err) {
      res.resdirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id)
    }
  })
})


module.exports = router;
