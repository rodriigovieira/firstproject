var express = require('express');
var app = express();
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var flash = require("connect-flash");

var authRoute = require("./routes/auth");
var indexRoute = require("./routes/index");
var commentRoute = require("./routes/comments");

mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.set('views', path.join(__dirname, 'views'));


app.use(flash());

app.use(require("express-session")({
    secret: "IJEJFJEIJF393488AJFIEJFIEJRFNijiJIIDIEJIDdeijienfi3u49438993r fejifejifief9fe9fef",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(methodOverride("_method"));

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoute);
app.use(authRoute);
app.use(commentRoute);

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send(err.message);
});

app.listen(process.env.PORT, process.env.IP, () => {
    console.log('Server has started.');
});

// module.exports = app;
