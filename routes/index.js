var express = require("express");
var router = express.Router();
var Datadb = require("../models/datadb");
var Comment = require("../models/comment");

router.get("/index", function (req, res) {
    Datadb.find({}, function (err, full_resp) {
        if (err) {
            console.log("234");
            console.log(err);
        } else {
            res.render("oldfiles/index", {campgrounds: full_resp});
        }
    })
});

router.post("/index", isLoggedIn, function (req, res) {
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    Datadb.create({
        name: req.body.name,
        image: req.body.image,
        desc: req.body.desc,
        price: req.body.price,
        author: author
    }, function (err, res) {
        if (err) {
            console.log("123");
            console.log(err);
        } else {
            console.log("345");

            console.log(res);
        }
    });
    //redirect
    res.redirect("/index");
});

router.get("/index/new",isLoggedIn, function (req, res) {
    res.render("oldfiles/new");
});

// SHOW - shows more info about one campground
router.get("/index/:id", function (req, res) {
    //find the campground with provided ID
    Datadb.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err || !foundCampground) {
            console.log(err);
            console.log(5342);
            req.flash("error", "Not found.");
            res.redirect("/index");
        } else {

            //render show template with that campground
            res.render("oldfiles/show", {campgrounds: foundCampground});
        }
    });
});

router.get("/index/:id/edit", function (req, res) {
    if(req.isAuthenticated()) {
        Datadb.findById(req.params.id, function (err, foundEntry) {
            if (err || !foundEntry) {
                console.log(5432);
                console.log(err);
                req.flash("error", "Not found.");
                res.redirect("back");
            } else {
                if (foundEntry.author.id.equals(req.user._id)) {
                    res.render("edit", {campgrounds: foundEntry});
                } else {
                    req.flash("error", "You don't have permission to perform this action");
                    res.redirect("back");
                }
            }
        })
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("/login");
    }
});

router.put("/index/:id/", checkEntryOwnership, function (req, res) {
    Datadb.findByIdAndUpdate(req.params.id, req.body.datadb, function (err, updatedEntry) {
        if (err || !updatedEntry) {
            console.log(534);
            console.log(err);
            req.flash("error", "Something went wrong." + err);
            res.redirect("/index");
        } else {
            res.redirect("/index/" + req.params.id);
        }
    })
});

router.delete("/index/:id", checkEntryOwnership, function (req, res) {
    Datadb.findByIdAndRemove(req.params.id, function (err, output) {
        if (err || !output) {
            console.log(5324);
            console.log(err);
            req.flash("error", "Something went wrong." + err);
            res.redirect("/index");
        } else {
            res.redirect("/index");
        }
    })
});

function checkEntryOwnership(req, res, next) {
    if(req.isAuthenticated()) {
        Datadb.findById(req.params.id, function (err, foundEntry) {
            if (err || !foundEntry) {
                console.log(4930);
                console.log(err);
                req.flash("error", "The campground doesn't exit.");
                res.redirect("back");
            } else {
                if (foundEntry.author.id.equals(req.user._id)) {
                   return next();
                } else {
                    req.flash("error", "You don't have permission to do that.");
                    res.redirect("back");
                }
            }
        })
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please login first!");
    res.redirect("/login");
}


module.exports = router;