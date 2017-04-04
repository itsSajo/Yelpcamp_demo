var
    express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    passport      = require('passport'),
    LocalStrategy = require('passport-local'),
    Campground    = require("./models/campground"),
    Comment       = require("./models/comment"),
    User          = require("./models/user"),
    seedDB        = require("./seeds")
;

// SETUP EXPRESS
app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")
// dirname zwraca nam sciezke absolutną, gdzie znajduje sie skrypt
app.use(express.static(__dirname + "/public"))

// cleaning DB
seedDB();

// PASSPORT SETUP
app.use(require("express-session")({
  secret            : "Secret",
  resave            : false,
  saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())

//END PASSPORT SETUP

mongoose.connect("mongodb://localhost/yelp_camp");

// MIDDLEWARE CLASS
app.use(function(req, res, next){
  // template to be in every called route
  res.locals.currentUser = req.user;
  // moving to next middleware (example routeHandler)
  next();
})


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
        campgrounds : allCampgrounds,
        currentUser : req.user
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

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
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

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
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

app.get("/register", function(req, res){
  res.render("register")
})

app.post('/register', function(req, res){
  var newUser = new User({username : req.body.username});
  // creating new user in db with hash key as password
  // register is from a plugin passport-local-moongose from user model
 // so u can use methods to db
  User.register(newUser, req.body.password, function(err, user){
    if(err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function(){
      res.redirect("/campgrounds")
    })
  })
})

app.get("/login", function(req, res){
  res.render("login");
})

app.post("/login", passport.authenticate("local", {
  successRedirect : "/campgrounds",
  failureRedirect : "/login"
}), function(req, res){});

app.get("logout", function(req, res){
  req.logout();
  res.redirect("/campgrounds");
})

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

// Serwer start
app.listen(3000, function(){
  console.log("Server is running");
});
