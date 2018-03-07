const express = require("express"),
      bcrypt  = require("bcryptjs"),
      router  = express.Router();

// MODELS
const User = require("../models/User");

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
        User.findOne({email: req.body.email})
            .then(email => {
                if(email) {
                    req.flash("error_msg", "Email already registered");
                    res.redirect("/users/login");
                }
                else {
                    const newUser = new User ({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    });
            
                    bcrypt.genSalt(10, (error, salt) => {
                        bcrypt.hash(newUser.password, salt, (error, hash) => {
                            if(error) {
                                console.log(error);
                            } 
                            else {
                                newUser.password = hash;
                                newUser.save()
                                    .then(user => {
                                        req.flash("success_msg", "You are now registered, login below.");
                                        res.redirect("/users/login");
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        return;
                                    });
                            }
                        });
                    });
                }
            });
    }

});

module.exports = router;