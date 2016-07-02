var express = require('express');
var router = express.Router();
var winston = require('winston');
var logger = winston.loggers.get('default');

var Shutter = require("../services/shuttersCommand");

var i18n = require("i18n");
var siteTitle = i18n.__("siteTitle");
var db = require('../db');

// ########################################
// ### Shutters functions
// ########################################

function renderAll(req, res, ok, shutter) {
    logger.info("get.renderAll(ok, shutter): " + ok + ", " + shutter);
    res.render('shutters', {
        user : req.user,
        shutters : db.shutters.listAllShutters(),
        shutter : shutter,
        ok : ok,
        title : siteTitle
    });
}

function renderList(req, res) {
    logger.info("get.renderList()");
    renderAll(req, res);
}

function renderAdd(req, res) {
    logger.info("get.renderAdd()");
    var shutter = {
        name : '',
        displayName : '',
        remoteControlKey : '',
        open : false
    };
    res.render('shutter', {
        user : req.user,
        shutter : shutter,
        title : siteTitle
    });
}

function renderEdit(req, res) {
    logger.info("get.renderEdit(id): " + req.params.id);
    db.shutters.findShutterById(req.params.id, function(err, shutter) {
        res.render('shutter', {
            user : req.user,
            shutter : shutter,
            title : siteTitle
        });
    });
}

function postEdit(req, res) {
    logger.info("post.postEdit( id , name ) : " + req.params.id + ", " + req.body.name);
    db.shutters.update(req.params.id, req.body.name, req.body.displayName, req.body.remoteControlKey, req.body.state, function(err, shutter) {
        renderAll(req, res, true, shutter);
    });
}

function renderRemove(req, res) {
    logger.info("get.renderRemove(id): " + req.params.id);
    db.shutters.removeShutterById(req.params.id, function(err, shutter) {
        if (err === null) {
            renderAll(req, res, true);
        }
    });
}

function renderAction(req, res) {
    logger.info("get.renderAction(id, action): " + req.params.id + ", " + req.params.action);
    var shutter = new Shutter();
    if (req.params.action === "open") {
        shutter.openOne(req.params.key);
    }
    if (req.params.action === "close") {
        shutter.closeOne(req.params.key);
    }
    db.shutters.setShutterOpenState(req.params.id, req.params.action, function(err, shutter) {
        if (err === null) {
            renderAll(req, res, true, shutter);
        } else {
            if (shutter !== null) {
                renderAll(req, res, false, shutter);
            } else {
                res.render('error', {
                    error : err
                });
            }
        }
    });
}

// ########################################
// ### Shutters routes
// ########################################

router.get('/list', require('connect-ensure-login').ensureLoggedIn(), renderList);
router.get('/add', require('connect-ensure-login').ensureLoggedIn(), renderAdd);
router.get('/:id/edit', require('connect-ensure-login').ensureLoggedIn(), renderEdit);
router.post('/:id/edit', require('connect-ensure-login').ensureLoggedIn(), postEdit);
router.get('/:id/remove', require('connect-ensure-login').ensureLoggedIn(), renderRemove);
router.get('/:id/:key/:action', require('connect-ensure-login').ensureLoggedIn(), renderAction);

module.exports = router;
