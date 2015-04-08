var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
//passport
var steamAuth = require('models/steamAuth');
//
var log = require('models/log')(module);
var db = require('models/db');
//
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var config = require('./config/index');
var app = express();
//app.set('port', config.get('port'));
log.info(config.get('port'));
// view engine setup
app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'something',
    resave: true,
    saveUninitialized: true
}));

app.use(steamAuth.initialize());
app.use(steamAuth.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next){
  if(req.url === '/hello'){
   res.end("Hello world")
  }
  next();
});
app.use(function(req, res, next){
  if(req.url === '/hero'){
    db('p4m.d2_hero', 1, function(hero){
      res.end('hero : ' + hero);
    })
  } else {
    next();
  }
});
app.get(/*'/', routes*/'/', function(req, res){
  res.render('index', { user: req.user });
});
app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});
app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});
app.get('/auth/steam',
    steamAuth.authenticate('steam', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/');
});
app.get('/auth/steam/return',
    steamAuth.authenticate('steam', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/');
    });
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

module.exports = app;
