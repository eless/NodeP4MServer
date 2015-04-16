var express = require('express.io');//require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var steamAuth = require('models/steamAuth');
var log = require('models/log')(module);
var db = require('models/db');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var users = require('./routes/users');
var config = require('./config/index');
var app = express().http().io();
log.info(process.env.PORT || config.get('port'));
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
    secret: process.env.NODE_ENV == 'development' ? config.get('session:secret'): process.env.SESSION_SECRET,
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
    db.selectHero('p4m.d2_hero', 1, function(hero){
      res.end('hero : ' + hero);
    })
  } else {
    next();
  }
});
//routers
var index = require('./routes/index'),
    account = require('./routes/account'),
    profile = require('./routes/profile'),
    login = require('./routes/login'),
    steam = require('./routes/steam'),
    logout = require('./routes/logout')
    ;

app.get('/', index.router);
app.get('/account', ensureAuthenticated, account.router);
app.get('/profile/:id', profile.router);
app.get('/login', login.router);
app.get('/auth/steam',
    steamAuth.authenticate('steam', { failureRedirect: '/login' }),
    steam.router);
app.get('/auth/steam/return',
    steamAuth.authenticate('steam', { failureRedirect: '/login' }),
    steam.router);
app.get('/logout', logout.router);
app.use('/users', users);

//client events
app.io.route('addToTournament', account.events);
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
      error: err,
      title: 'P4M develop test'
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    title: 'P4M develop test'
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

module.exports = app;
