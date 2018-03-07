const express = require("express"),
      router  = express.Router();

/* MODELS */
const Idea = require("../models/Idea"); 

// INDEX
router.get("/", (req, res) => {
    Idea.find({})
        .sort({date: "desc"})
        .then(ideas => {
            res.render("ideas/index", {ideas: ideas});
        });
});

// NEW
router.get("/new", (req, res) => {
    res.render("ideas/new");
});

// CREATE
router.post("/", (req, res) => {
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
router.get("/:id/edit", (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            res.render("ideas/edit", {idea: idea});
        });
});

// UPDATE
router.put("/:id", (req, res) => {
    let id = req.params.id,
        data = req.body;

    Idea.findByIdAndUpdate(id, data)
        .then(() => {
            req.flash("info_msg", "Video idea updated");
            res.redirect("/ideas");
        })
        .catch(err => console.log(err));
});

// DELETE
router.delete("/:id", (req, res) => {
    let id = req.params.id;
    
    Idea.findByIdAndRemove(id)
        .then(() => {
            req.flash("success_msg", "Video idea removed")
            res.redirect("/ideas");
        })
        .catch(err => console.log(err));
});

module.exports = router;