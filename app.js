var createError = require('http-errors');
var express = require('express');
const cloudinary = require('cloudinary').v2
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
var logger = require('morgan');
const Handlebars = require('handlebars');
const hbs = require('express-handlebars');
const helpers = require('handlebars-helpers')();

require('dotenv').config();
cloudinary.config({
  cloud_name: 'yenngan',
  api_key: '884464388927933',
  api_secret: 'HBBYilY1aiSYle19tC6dFJH57qI'
})
const { MongoClient } = require("mongodb");
const mongoose = require('./dal/db');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
mongoose.mongoose();

const session = require("express-session");

const passport = require('./passport');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const booksRouter = require('./routes/home');
const listRouter = require('./routes/listbook');

const app = express();
app.use(bodyParser.urlencoded({'extended':false}))
// hbs.registerPartials(__dirname + '/views/partials');
// hbs.registerPartial('bestseller', fs.readFileSync(__dirname + '/views/partials/bestseller.hbs', 'utf8'));
// hbs.registerPartial('related', fs.readFileSync(__dirname + '/views/partials/related.hbs', 'utf8'));



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs({ 
  extname:'hbs', 
  helpers: helpers,
  defaultView: 'default',
  layoutsDir: __dirname + '/views',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
 }));
 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// passport middlewares 
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session({secret: process.env.SESSION_SECRET}));

//pass req.user to res.local
app.use(function (req, res, next) {
  res.locals.user = req.user;
  next()
});

app.use('/', indexRouter);
//app.use('/account', indexRouter);
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
