var express = require('express');
var passport = require('passport');
var httpProxy = require('http-proxy');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn()
var router = express.Router();

var env = process.env;

// This adds support for the current way to sso
var authenticateWithDefaultPrompt = passport.authenticate('oidc', {});
var authenticateWithPromptNone = passport.authenticate('oidc', {
  prompt: 'none'
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/reports/');
});

router.get('/login',
  function (req, res, next) {
    if (env.CHECK_SESSION === 'true' && req.query.sso !== 'false') {
      return authenticateWithPromptNone(req, res, next);
    }
    return authenticateWithDefaultPrompt(req, res, next);
  },
  function (req, res) {
    res.redirect('/reports/');
  });

router.get('/authorization-code/callback',
  function (req, res, next) {
    passport.authenticate('oidc', function (err, user, info) {
      if (err) {
        next(err);
      }

      if (info === 'login_required') {
        return res.redirect('/login?sso=false');
      }
      
      if (user) {
        return req.login(user, function (err) {
          if (err) {
            next(err);
          }
          res.redirect(req.session.returnTo || '/reports/');
        });
      }

      next(new Error(JSON.stringify(info)));
    })(req, res, next);
  });

module.exports = router;
