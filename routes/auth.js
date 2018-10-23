var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

router.get("/", function (req, res) {
    res.render("oldfiles/landing");
});

router.get("/register", function (req, res) {
    res.render("register");
});

router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message + ".");
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp, " + user.username + ".");
            res.redirect("/index");
        });
    });
});
//
// router.get("/login", function (req, res) {
//     if(req.isAuthenticated()) {
//         res.render("login", {message: req.flash("error")});
//     }
//         // req.flash("error", "You are already logged in.");
//         // res.redirect("/index");
// });

router.get("/login", function (req, res) {
    if (req.isAuthenticated()) {
        req.flash("error", "You are already logged in.");
        res.redirect("back");
    } else {
        res.render("login");
    }
});


router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/index",
        failureRedirect: "/login"
    }), function (req, res) {
});

router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "You've been logged out successfully!");
    res.redirect("/index");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please login first!");
    res.redirect("/login");
}

module.exports = router;