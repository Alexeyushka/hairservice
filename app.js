var express = require("express");
var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser = require("body-parser");
var User = require("./models/user");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost/hairsalon_db");

var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(require("express-session")({
	secret: "Rusty is best dog",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('scripts'));


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//===========
//ROUTES


// =======================================???????????
app.post("/tea_added", function(req, res){
	const click = {clickTime: new Date()};
	console.log(click);
	
	User.find({}, function(err, foundData) {
		database = foundData[5];
		console.log(foundData[5]);
		// foundData[5].save( { tea : 1 } );
		foundData[5].tea = foundData[5].tea + 1;
		console.log(foundData[5]);
		// foundData[0].tea.save(click, function (err, result) {
		// if (err) {
		// 	console.log(err);
		// }
		// console.log('click added to db');
		// res.sendStatus(201);
		// });
	});
});
//=======================================???????????

//handling user sign up
app.get("/", function(req, res){
	res.render("home");
});

app.get("/admin", isLoggedIn, function(req, res){
	res.render("admin");
	User.find({}, function(err, foundData) {
		database = foundData[5];
		if (foundData[5].tea === 1) {
			console.log("added");
		}
	});
});

app.get("/secret", isLoggedIn, function(req, res){
	var database = [];
	User.find({}, function(err, foundData) {
		database = foundData[5];
		console.log(database.tea);
	});
	if (req.user.username == "admin")
	{
		console.log("hello admin");
		res.redirect("admin");
	} 
	else 
	{
		res.render("secret");
	}
});

// Auth Routes
//show signup form
app.get("/register", function(req, res){
	res.render("register");
});

//handling user sign up
app.post("/register", function(req, res){
	req.body.username
	req.body.password
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
			
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/secret");			
		});
	});
});


//LOGIN Routes
//render login form

app.get("/login", function(req, res){
	res.render("login");
});
//login logic
app.post("/login", passport.authenticate("local", {
	successRedirect: "/secret",
	failureRedirect: "/login"
}), function(req, res){

});

app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/");
});


function isLoggedIn(req, res, next){
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};

app.listen(3000, process.env.IP, function(){
	console.log("server started");
})