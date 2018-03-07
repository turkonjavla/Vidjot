const express = require("express"),
      router  = express.Router();

// LOGIN
router.get("/login", (req, res) => {
    res.send("ok");
});

// REGISTER
router.get("/register", (req, res) => {
    res.send("register");
});

module.exports = router;