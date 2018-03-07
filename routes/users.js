const express = require("express"),
      router  = express.Router();

// LOGIN
router.get("/login", (req, res) => {
    res.render("users/login");
});

// REGISTER
router.get("/register", (req, res) => {
    res.render("users/register");
});

// REGISTER LOGIC
router.post("/register", (req, res) => {
    let errors = [],
        name = req.body.name,
        email = req.body.email,
        password = req.body.password,
        confirmPassword = req.body.confirmPassword;
    
    if(!name) {
        errors.push({text: "Please enter a name"});
    }
    if(!email) {
        errors.push({text: "Please enter an email"});
    }
    if(password != confirmPassword) {
        errors.push({text: "Passwords don\'t match"});
    }
    if(password.length < 4) {
        errors.push({text: "Password must be at least 4 characters"});
    }

    if(errors.length > 0) {
        res.render("users/register", {
            errors: errors,
            name: req.body.name,
            email: req.body.email
        });
    }
    else {
        res.send("ok");
    }

});

module.exports = router;