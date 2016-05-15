var express = require('express');
var router = express.Router();
var passport = require('passport');

var i18n = require("i18n");
var siteTitle = i18n.__("siteTitle");

var winston = require('winston');
var logger = winston.loggers.get('default');

// ########################################
// ### Main routes functions
// ########################################

router.get('/', function(req, res, next) {
    res.render('index', {
        user : req.user,
        title : siteTitle
    });
});
router.get('/index', function(req, res) {
    res.render('index', {
        user : req.user,
        title : siteTitle
    });
});
router.get('/login', function(req, res) {
    res.render('index', {
        user : req.user,
        title : siteTitle
    });
});
router.get('/error', function(req, res) {
    res.render('error', {
        title : siteTitle
    });
});

router.post('/login', passport.authenticate('local', {
    failureRedirect : '/'
}), function(req, res) {
    res.redirect('/shutters/list');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;
