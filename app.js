var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var dotenv = require('dotenv')
var passport = require('passport');
var OidcStrategy = require('passport-openidconnect').Strategy;

dotenv.load();

var routes = require('./routes/index');
var reports = require('./routes/reports');

// Default everything to false
process.env.CHECK_SESSION = process.env.CHECK_SESSION || 'false';
process.env.LOGOUT_OKTA = process.env.LOGOUT_OKTA || 'false';
process.env.LOGOUT_FEDERATED = process.env.FEDERATED || 'false';

if (process.env.LOGOUT_FEDERATED === 'true') {
  process.env.LOGOUT_OKTA = 'true';
}

// This will configure Passport to use Okta via OpenIDConnect
var domain = process.env.OKTA_DOMAIN;
var clientID = process.env.OKTA_CLIENT_ID;
var clientSecret = process.env.OKTA_CLIENT_SECRET;
var callbackURL = process.env.OKTA_CALLBACK_URL;

var strategy = new OidcStrategy({
  issuer: `https://${domain}/oauth2/default`,
  authorizationURL: `https://${domain}/oauth2/default/v1/authorize`,
  tokenURL: `https://${domain}/oauth2/default/v1/token`,
  userInfoURL: `https://${domain}/oauth2/default/v1/userinfo`,
  clientID: clientID,
  clientSecret: clientSecret,
  callbackURL: callbackURL,
  scope: 'openid profile'
}, (issuer, sub, profile, accessToken, refreshToken, done) => {
  return done(null, profile);
})

passport.use('oidc', strategy);

// you can use this section to keep a smaller payload
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(cookieParser());
app.use(session({
  secret: process.env.COOKIE_SECRET,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/reports/', reports);
app.use('/', routes);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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


module.exports = app;
