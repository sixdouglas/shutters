var winston = require('winston');
var logger = winston.loggers.get('default');
var exec = require('child_process').exec;
var db = require('../db');

var config = require('../config/config');

var CLOSE = "on";
var OPEN = "off";

// services/shutter.js
function Shutter() {
}

function write(value, state, callback) {
    var action;
    if (state === OPEN) {
        logger.info("opening: " + value);
        action = "on";
    } else {
        logger.info("closing: " + value);
        action = "off";
    }

    // radioEmission 17 20210234 0 on
    var child = exec(config.shuttersCommand.programPath + ' ' + config.shuttersCommand.gpioPin + ' ' + value + ' ' + action, function(error, stdout, stderr) {
        if (error !== null) {
            logger.error('exec [' + config.shuttersCommand.programPath + ' ' + config.shuttersCommand.gpioPin + ' ' + value + ' ' + action + ']: ' + error);
            if (stdout !== undefined) {
                logger.info('    stdout: ' + stdout);
            }
            if (stderr !== undefined) {
                logger.info('    stderr: ' + stderr);
            }
        } else {
            logger.info('exec [' + config.shuttersCommand.programPath + ' ' + config.shuttersCommand.gpioPin + ' ' + value + ' ' + action + ']: OK');
            if (stdout !== undefined) {
                logger.info('    stdout: ' + stdout);
            }
            if (stderr !== undefined) {
                logger.info('    stderr: ' + stderr);
            }
            if (callback !== undefined) {
                callback();
            }
        }
    });
}

function closeOne(key) {
    write(key, CLOSE);
}

function openOne(key) {
    write(key, OPEN);
}

function closeAll() {
    var shuttersList = db.shutters.listAllShutters();
    if (shuttersList !== undefined) {
        shuttersList.forEach(function(shutter) {
            closeOne(shutter.remoteControlKey);
            db.shutters.setShutterOpenState(shutter._id, "close");
        });
    }
}

function openAll() {
    var shuttersList = db.shutters.listAllShutters();
    if (shuttersList !== undefined) {
        shuttersList.forEach(function(shutter) {
            openOne(shutter.remoteControlKey);
            db.shutters.setShutterOpenState(shutter._id, "open");
        });
    }
}

Shutter.prototype.closeOne = closeOne;
Shutter.prototype.openOne = openOne;
Shutter.prototype.closeAll = closeAll;
Shutter.prototype.openAll = openAll;

module.exports = Shutter;