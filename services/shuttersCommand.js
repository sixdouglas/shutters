var winston = require('winston');
var logger = winston.loggers.get('default');
var exec = require('child_process').exec;
var db = require('../db');

var GPIO_DEFAULT_PATH = '/usr/local/bin/radioEmission';
var PIN_SEND = "17";
var CLOSE = "on";
var OPEN = "off";

// services/shutter.js
function Shutter() {
}

function write(pin, value, state, callback) {
    if (state === OPEN) {
        logger.info("opening: " + value);
    } else {
        logger.info("closing: " + value);
    }

    // radioEmission 17 20210234 0 on
    var child = exec(GPIO_DEFAULT_PATH + " " + pin + " 0 " + value, function(error, stdout, stderr) {
        if (error !== null) {
            logger.error('exec [' + GPIO_DEFAULT_PATH + " " + pin + " 0 " + value + ']: ' + error);
        } else {
            logger.debug('exec [' + GPIO_DEFAULT_PATH + " " + pin + " 0 " + value + ']: OK');
            if (callback !== undefined) {
                callback();
            }
        }
    });
}

function closeOne(id) {
    write(PIN_SEND, id, CLOSE);
}

function openOne(id) {
    write(PIN_SEND, id, OPEN);
}

function closeAll() {
    var shuttersList = db.shutters.listAllShutters();
    if (shuttersList !== undefined) {
        shuttersList.forEach(function(shutter) {
            closeOne(shutter._id);
            db.shutters.setShutterOpenState(shutter._id, "close");
        });
    }
}

function openAll() {
    var shuttersList = db.shutters.listAllShutters();
    if (shuttersList !== undefined) {
        shuttersList.forEach(function(shutter) {
            openOne(shutter._id);
            db.shutters.setShutterOpenState(shutter._id, "open");
        });
    }
}

Shutter.prototype.closeOne = closeOne;
Shutter.prototype.openOne = openOne;
Shutter.prototype.closeAll = closeAll;
Shutter.prototype.openAll = openAll;

module.exports = Shutter;