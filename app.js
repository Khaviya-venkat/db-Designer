var express               = require("express"),
	app 				  = express(),
    mongoose              = require("mongoose"),
	passport              = require("passport"),
	bodyParser            = require("body-parser"),
	User                  = require("./models/user"),
	Table				  = require("./models/table"),
	LocalStrategy         = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose");
	mongoDB 			  = ("mongodb://localhost/groceonline");

mongoose.set('useUnifiedTopology', true);
mongoose.connect(mongoDB, {useNewUrlParser: true});

app.set("view engine","ejs");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended : true}));
app.use(require("express-session")({
	  secret : "this is a secret",
	  resave : false,
	  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",function(req,res){
	res.render("home");
});

app.get("/signup",function(req,res){
	res.render("register");
});

app.post("/signup",function(req,res){
	req.body.username
	req.body.password
	req.body.loginas
	User.register(new User({username: req.body.username, loginas: req.body.loginas}),req.body.password,function(err,user){
		passport.authenticate("local")(req,res,function(){
			res.redirect("/dbdesigner");
		});
	});
});

app.get("/login",function(req,res){
	res.render("login");
	req.logout();
});

app.post("/login",passport.authenticate("local",{
	successRedirect:"/dbdesigner",
	failureRedirect:"/login"
}),function(req,res){
	req.body.username
	req.body.password
	req.body.loginas
});

app.get("/dbdesigner", function(req, res){
	Table.find(function(err, tables){
		if(err){
			console.log(err);
		}
		else{
			res.render("dbdesignerdisplay", {tables: tables});			
		}
	});
});

app.get("/dbdesigner/create", function(req, res){
	res.render("dbdesigner");
});

app.post("/dbdesigner", function(req, res){
	var table = {username: req.user.username, name: req.body.myInput, datatype: req.body.datatype, constraint: req.body.constraint, tablename: req.body.tablename};
	Table.create(table, function(table){
		res.redirect("/dbdesigner/create");
	});
});

app.listen(3000, function(){
	console.log("Server is listening");
});
