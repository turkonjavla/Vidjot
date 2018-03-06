const bodyParser = require("body-parser"),
      mongoose   = require("mongoose"),
      express    = require("express"),
      exphbs     = require("express-handlebars"),
      app        = express(),
      port       = 5050 || process.env.PORT;

const db = process.env.DATABASEURL;
mongoose.connect(db)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
    res.redirect("/ideas");
});

app.get("/ideas", (req, res) => {
    res.render("index");
});

app.get("/ideas/new", (req, res) => {
    res.render("new");
});

app.get("/about", (req, res) => {
    res.render("about");
});

// Open connection
app.listen(port, process.env.IP, () => {
    console.log(`Server open at port: ${port}`)
});