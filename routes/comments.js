var express = require("express");
var router = express.Router();
var Datadb = require("../models/datadb");
var Comment = require("../models/comment");

router.get("/index/:id/comments/new", isLoggedIn, function (req, res) {
    Datadb.findById(req.params.id, function (err, out) {
        if (err || !out) {
            req.flash("error", "Not found.");
            res.redirect("back");
            console.log(32);
            console.log(err);
        } else {
            res.render("comments/new", {campgrounds: out});
        }
    })
});

router.post("/index/:id/comments", isLoggedIn, function (req, res) {

    Datadb.findById(req.params.id, function (err, encontrado) {
        if (err || !encontrado) {
            req.flash("error", "Not found.");
            res.redirect("back");
            console.log(534);
            console.log(err);
        } else {
            Comment.create({
                desc: req.body.desc
            }, function (err, comentariocriado) {
                if (err || !comentariocriado) {
                    req.flash("error", "Not found.");
                    res.redirect("back");
                    console.log(4343);
                    console.log(err);
                } else {
                    comentariocriado.author.id = req.user._id;
                    comentariocriado.author.username = req.user.username;
                    comentariocriado.save();
                    encontrado.comments.push(comentariocriado);
                    encontrado.save();
                    console.log(comentariocriado);
                    res.redirect("/index/" + req.params.id);
                }
            });
        }
    })
});

router.get("/index/:id/comments/:idcomment/edit", function (req, res) {
    Datadb.findById(req.params.id, function (err, entryOuput) {
        if (err || !entryOuput) {
            req.flash("error", "Not found.");
            res.redirect("back");
            console.log(55543);
            console.log(err);
        } else {
            Comment.findById(req.params.idcomment, function (err, commentOutput) {
                if (err || !commentOutput) {
                    req.flash("error", "Not found.");
                    res.redirect("back");
                    console.log(55443322);
                    console.log(err);
                } else {
                    res.render("comments/edit", {commentData: commentOutput, campgrounds: entryOuput});
                }
            })
        }
    })
});

router.put("/index/:id/comments/:idcomment", checkCommentOwnership, function (req, res) {
    Datadb.findById(req.params.id, function (err, entryOutput) {
        if (err || !entryOutput) {
            req.flash("error", "Not found.");
            res.redirect("/index");
            console.log(444333);
            console.log(err);
        } else {
            Comment.findByIdAndUpdate(req.params.idcomment, {desc: req.body.newcomment}, function (err, commentOutput) {
                if (err || !commentOutput) {
                    req.flash("error", "Not found.");
                    res.redirect("/index");
                    console.log(4110);
                    console.log(err);
                } else {
                    console.log(req.body.newcomment);
                    res.redirect("/index/" + req.params.id);
                }
            })
        }
    });
});

router.delete("/index/:id/comments/:idcomment/delete", checkCommentOwnership, function (req, res) {
   Comment.findByIdAndRemove(req.params.idcomment, function (err, output) {
       if (err || !output) {
           req.flash("error", "Not found.");
           res.redirect("/index");
           console.log(1122);
           console.log(err);
       } else {
           res.redirect("/index/" + req.params.id);
       }
   })
});

function checkCommentOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.idcomment, function (err, foundComment) {
            if (err || !foundComment) {
                req.flash("error", "Not found.");
                res.redirect("/index");
                console.log(4930);
                console.log(err);
                res.redirect("/index");
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
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
    req.flash("error", "You have to be logged in to do that.");
    res.redirect("/login");
}


module.exports = router;