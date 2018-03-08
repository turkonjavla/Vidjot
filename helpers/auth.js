module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if(req.isAuthenticated()) {
            return next();
        }
        else {
            req.flash("error_msg", "You have to be logged in to do that!");
            res.redirect("/users/login");
        }
    }
}