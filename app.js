const exphbs         = require("express-handlebars"),
      methodOverride = require("method-override"),
      session        = require("express-session"),
      flash          = require("connect-flash"),
      bodyParser     = require("body-parser"),
      mongoose       = require("mongoose"),
      express        = require("express"),
      app            = express(),
      port           = 5050 || process.env.PORT;


/* MODELS */
 const Idea = require("./models/Idea"); 

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
app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");   
    res.locals.info_msg = req.flash("info_msg"); 
    res.locals.error =  req.flash("error");
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

// INDEX
app.get("/ideas", (req, res) => {
    Idea.find({})
        .sort({date: "desc"})
        .then(ideas => {
            res.render("index", {ideas: ideas});
        });
});

// NEW
app.get("/ideas/new", (req, res) => {
    res.render("new");
});

// CREATE
 app.post("/ideas", (req, res) => {
    let details  = req.body.details,
        title    = req.body.title,
        errors   = [],
        ideaData = ({title: title, details: details});

    if(!title) {
        errors.push({text: "Title can\'t be empty."});
    }
    if(!details) {
        errors.push({text: "Details can\'t be empty."});
    }

    if(errors.length > 0) {
        res.render("new", {errors: errors});
    }
    else {
        new Idea(ideaData)
            .save()
            .then(idea => {
                req.flash("success_msg", "Video idea added");
                res.redirect("/ideas");
            })
            .catch(err => console.log(err));
    }
}); 

// SHOW

// EDIT
app.get("/ideas/:id/edit", (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            res.render("edit", {idea: idea});
        });
});

// UPDATE
app.put("/ideas/:id", (req, res) => {
    let id = req.params.id,
        data = req.body;

    Idea.findByIdAndUpdate(id, data)
        .then(() => {
            req.flash("info_msg", "Video idea updated");
            res.redirect("/ideas");
        })
        .catch(err => console.log(err));
});

app.delete("/ideas/:id", (req, res) => {
    let id = req.params.id;
    
    Idea.findByIdAndRemove(id)
        .then(() => {
            req.flash("success_msg", "Video idea removed")
            res.redirect("/ideas");
        })
        .catch(err => console.log(err));
});

// ABOUT
app.get("/about", (req, res) => {
    res.render("about");
});

// Open connection
app.listen(port, process.env.IP, () => {
    console.log(`Server open at port: ${port}`)
});