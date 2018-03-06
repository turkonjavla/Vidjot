const exphbs  = require("express-handlebars"),
      express = require("express"),
      app     = express(),
      port    = 5050 || process.env.PORT;

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
    res.redirect("/ideas");
});

app.get("/ideas", (req, res) => {
    res.render("index");
});

app.get("/about", (req, res) => {
    res.render("about");
});

// Open connection
app.listen(port, process.env.IP, () => {
    console.log(`Server open at port: ${port}`)
});