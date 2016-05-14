var express = require('express');
var router = express.Router();
var winston = require('winston');
var logger = winston.loggers.get('default');

var i18n = require("i18n");
var siteTitle = i18n.__("siteTitle");
var db = require('../db');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

function renderProfileOk(req, res, user) {
    res.render('profile', {
        user : user,
        title : siteTitle
    });
}

function renderProfile(req, res) {
    renderProfileOk(req, res, req.user);
}

function renderEditUser(req, res, user) {
    res.render('editProfile', {
        user : user,
        title : siteTitle
    });
}

function renderEdit(req, res) {
    db.users.findUserById(req.params.id, function(err, user) {
        renderEditUser(req, res, user);
    });
}

function postEdit(req, res) {
    logger.info("post.postEdit( id , name ) : " + req.params.id + ", " + req.body.username);
    if (req.body.password === req.body.repassword) {
        res.locals.sessionFlash = {
            type : 'success',
            message : 'Update OK.'
        };
        var passwordHash = require('password-hash');
        var hashed = passwordHash.generate(req.body.password);
        db.users.update(req.params.id, req.body.username, req.body.displayName, req.body.email, req.body.password, function(err, user) {
            if (err) {
                logger.info("post.postEdit : update error");
                res.locals.sessionFlash = {
                    type : 'error',
                    message : 'Update Error: ' + err
                };
                var formuser = {
                    _id : req.user._id,
                    displayName : req.body.displayName,
                    username : req.body.username,
                    email : req.body.email
                };
                renderEditUser(req, res, formuser);
            } else {
                res.locals.sessionFlash = {
                    type : 'success',
                    message : 'Update OK.'
                };
                renderProfileOk(req, res, user);
            }
        });
    } else {
        logger.info("post.postEdit : password don't match");
        res.locals.sessionFlash = {
            type : 'error',
            message : 'Password don\'t match.'
        };
        var user = {
            _id : req.user._id,
            displayName : req.body.displayName,
            username : req.body.username,
            email : req.body.email
        };
        renderEditUser(req, res, user);
    }
}

router.get('/profile', require('connect-ensure-login').ensureLoggedIn(), renderProfile);
router.get('/:id/edit', require('connect-ensure-login').ensureLoggedIn(), renderEdit);
router.post('/:id/edit', require('connect-ensure-login').ensureLoggedIn(), postEdit);

module.exports = router;
