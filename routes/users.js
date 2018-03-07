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

module.exports = router;