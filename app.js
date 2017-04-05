// MODULES
var
    express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local'),
    methodOverride  = require('method-override')
;
// MODELS
var
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds")
;

// ROUTES
var
    commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    authRoutes       = require("./routes/auth")
;

mongoose.connect("mongodb://localhost/yelp_camp");

// SETUP EXPRESS
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
// dirname returning abosulte path
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"))

// cleaning DB
// seedDB();

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
passport.deserializeUser(User.deserializeUser());
//END PASSPORT SETUP



// MIDDLEWARE CLASS
app.use(function(req, res, next){
  // template to be in every called route
  res.locals.currentUser = req.user;
  // moving to next middleware (example routeHandler)
  next();
})

// using routes middleware
app.use(authRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);


// Serwer start
app.listen(3000, function(){
  console.log("Server is running");
});
