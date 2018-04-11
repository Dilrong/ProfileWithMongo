var createError = require('http-errors');
var express = require('express');
var session = require("express-session");
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require("body-parser");
var logger = require('morgan');
var mongoose = require('mongoose');
var flash = require("connect-flash");
var passport = require("passport");
var setUpPassport = require("./setuppassport");

var routes = require('./routes');

var app = express();

// view engine setup
mongoose.connect("mongodb://52.78.150.110:27017/test");
setUpPassport();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(session(({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
})));
app.use(flash());

app.use(routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
