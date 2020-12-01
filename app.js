var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const hbs = require('hbs');
const fs = require('fs');
const { MongoClient } = require("mongodb");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const booksRouter = require('./routes/home');
const listRouter = require('./routes/list');

require('./dal/db');

const app = express();
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerPartial('bestseller', fs.readFileSync(__dirname + '/views/partials/bestseller.hbs', 'utf8'));
hbs.registerPartial('related', fs.readFileSync(__dirname + '/views/partials/related.hbs', 'utf8'));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/home', indexRouter);
app.use('/listbook',listRouter);



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
