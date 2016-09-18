var express = require('express');
var router = express.Router();
var passport = require('passport');

var i18n = require("i18n");
var siteTitle = i18n.__("siteTitle");

var winston = require('winston');
var logger = winston.loggers.get('default');

var config = require('../config/config');

// ########################################
// ### Main routes functions
// ########################################

router.get('/', function(req, res, next) {
    res.render('index', {
        user : req.user,
        title : siteTitle,
        contextPath : config.webApp.rootPath
    });
});
router.get('/index', function(req, res) {
    res.render('index', {
        user : req.user,
        title : siteTitle,
        contextPath : config.webApp.rootPath
    });
});
router.get('/gpio', require('connect-ensure-login').ensureLoggedIn(), function(req, res) {
    res.render('gpio', {
        user : req.user,
        title : siteTitle,
        contextPath : config.webApp.rootPath,
        iframeContextPath : config.webApp.iframeRootPath
    });
});
router.get('/login', function(req, res) {
    res.render('index', {
        user : req.user,
        title : siteTitle,
        contextPath : config.webApp.rootPath
    });
});
router.get('/error', function(req, res) {
    res.render('error', {
        title : siteTitle,
        contextPath : config.webApp.rootPath
    });
});

router.post('/login', passport.authenticate('local', {
    failureRedirect : config.webApp.rootPath + '/'
}), function(req, res) {
    var localConfig = require('../config/config');
    res.redirect(localConfig.webApp.rootPath + '/shutters/list');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect(config.webApp.rootPath + '/');
});

module.exports = router;
