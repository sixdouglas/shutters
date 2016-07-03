var winston = require('winston');
var logger = winston.loggers.get('default');
var exec = require('child_process').exec;
var db = require('../db');
var sleep = require('sleep');

var GPIO_DEFAULT_PATH = '/usr/local/bin/radioEmission';
var PIN_SEND = "17";
var CLOSE = "on";
var OPEN = "off";

// services/shutter.js
function Shutter() {
}

function write(pin, value, state, callback) {
    var action;
    if (state === OPEN) {
        logger.info("opening: " + value);
        action = "on";
    } else {
        logger.info("closing: " + value);
        action = "off";
    }

    // radioEmission 17 20210234 0 on
    var child = exec(GPIO_DEFAULT_PATH + " " + pin + " 0 " + value + " " + action, function(error, stdout, stderr) {
        if (error !== null) {
            logger.error('exec [' + GPIO_DEFAULT_PATH + " " + pin + ' 0 ' + value + ' ' + action + ']: ' + error);
            if (stdout !== undefined) {
                logger.info('    stdout: ' + stdout);
            }
            if (stderr !== undefined) {
                logger.info('    stderr: ' + stderr);
            }
        } else {
            logger.info('exec [' + GPIO_DEFAULT_PATH + " " + pin + ' 0 ' + value + ' ' + action + ']: OK');
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
    write(PIN_SEND, key, CLOSE);
}

function openOne(key) {
    write(PIN_SEND, key, OPEN);
}

function closeAll() {
    var shuttersList = db.shutters.listAllShutters();
    if (shuttersList !== undefined) {
        shuttersList.forEach(function(shutter) {
            closeOne(shutter.remoteControlKey);
            db.shutters.setShutterOpenState(shutter._id, "close");
            sleep.sleep(30);
        });
    }
}

function openAll() {
    var shuttersList = db.shutters.listAllShutters();
    if (shuttersList !== undefined) {
        shuttersList.forEach(function(shutter) {
            openOne(shutter.remoteControlKey);
            db.shutters.setShutterOpenState(shutter._id, "open");
            sleep.sleep(30);
        });
    }
}

Shutter.prototype.closeOne = closeOne;
Shutter.prototype.openOne = openOne;
Shutter.prototype.closeAll = closeAll;
Shutter.prototype.openAll = openAll;

module.exports = Shutter;