const LocalStrategy = require("passport-local").Strategy,
      mongoose      = require("mongoose"),
      bcrypt        = require("bcryptjs");

// MODELS
const User = require("../models/User");

module.exports = function(passport) {
      passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
            User.findOne({
                  email: email
            })
            .then(user => {
                  if(!user) {
                        return done(null, false, {message: "No user found"});
                  }
                  // Match password
                  bcrypt.compare(password, user.password, (error, isMatch) => {
                        if(error) throw error;
                        if(isMatch) {
                              return done(null, user);
                        }
                        else {
                              return done(null, false, {message: "Email and/or password don't match!"});
                        }
                  });
            });
      }));
      passport.serializeUser((user, done) => {
            done(null, user.id)
      });
      passport.deserializeUser((id, done) => {
            User.findById(id, (err, user) => {
                  done(err, user);
            });
      });
}