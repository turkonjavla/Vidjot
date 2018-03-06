const bodyParser = require("body-parser"),
      mongoose   = require("mongoose"),
      express    = require("express"),
      exphbs     = require("express-handlebars"),
      app        = express(),
      port       = 5050 || process.env.PORT;


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
        console.log(errors);
        res.render("new", {errors: errors});
    }
    else {
        new Idea(ideaData)
            .save()
            .then(idea => {
                res.redirect("/ideas");
            })
            .catch(err => console.log(err));
    }
}); 

// SHOW

//EDIT
app.get("/ideas/:id/edit", (req, res) => {
    let id = req.params.id;
    Idea.findOne(id)
        .then(idea => {
            res.render("edit", {idea: idea});
        });
});

//ABOUT
app.get("/about", (req, res) => {
    res.render("about");
});

// Open connection
app.listen(port, process.env.IP, () => {
    console.log(`Server open at port: ${port}`)
});