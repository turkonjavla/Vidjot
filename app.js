const exphbs         = require("express-handlebars"),
      methodOverride = require("method-override"),
      session        = require("express-session"),
      flash          = require("connect-flash"),
      bodyParser     = require("body-parser"),
      passport       = require("passport"),
      mongoose       = require("mongoose"),
      express        = require("express"),
      app            = express();

// Load Routes
const ideas = require("./routes/ideas");
      users = require("./routes/users");

// Passport Config
require("./config/passport")(passport);

/* DB Connection */
const db = process.env.DATABASEURL;
mongoose.connect(db)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));


app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "handlebars");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json()); 
app.use(methodOverride("_method"));

// Express session
app.use(session({
    secret: "ellie",
    resave: true,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");   
    res.locals.info_msg = req.flash("info_msg"); 
    res.locals.error =  req.flash("error");
    res.locals.user = req.user || null;
    next();
});

/* 
###############
    ROUTES
###############
 */

app.get("/", (req, res) => {
    res.redirect("/ideas");
});

// ABOUT
app.get("/about", (req, res) => {
    res.render("about");
});

// Use routes
app.use("/ideas", ideas);
app.use("/users", users);

// Open connection
app.listen(process.env.PORT, process.env.IP, () => {
    console.log(`Server open at port: ${port}`)
});