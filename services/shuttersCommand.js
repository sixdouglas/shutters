var winston = require('winston');
var logger = winston.loggers.get('default');
var exec = require('child_process').exec;
var db = require('../db');

var GPIO_DEFAULT_PATH = '/usr/local/bin/gpio';
var PIN_SEND = "1";
var CLOSE = "0";
var OPEN = "1";

// services/shutter.js
function Shutter() {
}

function mode(pin, modeVal, callback) {
    if (modeVal === undefined || modeVal === "") {
        modeVal = "out";
    }
    var child = exec(GPIO_DEFAULT_PATH + " mode " + pin + " " + modeVal, function(error, stdout, stderr) {
        if (error !== null) {
            logger.error('exec [' + GPIO_DEFAULT_PATH + " mode " + pin + " " + modeVal + ']: ' + error);
        } else {
            logger.debug('exec [' + GPIO_DEFAULT_PATH + " mode " + pin + " " + modeVal + ']: OK');
            if (callback !== undefined) {
                callback();
            }
        }
    });
}

function write(pin, value, callback) {
    var child = exec(GPIO_DEFAULT_PATH + " write " + pin + " " + value, function(error, stdout, stderr) {
        if (error !== null) {
            logger.error('exec [' + GPIO_DEFAULT_PATH + " write " + pin + " " + value + ']: ' + error);
        } else {
            logger.debug('exec [' + GPIO_DEFAULT_PATH + " write " + pin + " " + value + ']: OK');
            if (callback !== undefined) {
                callback();
            }
        }
    });
}

function read(pin, callback) {
    var child = exec(GPIO_DEFAULT_PATH + " read " + pin, function(error, stdout, stderr) {
        if (error !== null) {
            logger.error('exec [' + GPIO_DEFAULT_PATH + " read " + pin + ']: ' + error);
        } else {
            logger.debug('exec [' + GPIO_DEFAULT_PATH + " read " + pin + ']: OK');
            if (callback !== undefined) {
                callback();
            }
        }
    });
}

function pulse(pin, waitMilli, state, callback) {
    write(pin, state);
    setTimeout(function() {
        state = state === 1 ? 0 : 1;
        write(pin, state, callback);
    }, waitMilli);
}

function closeOne(id) {
    write(PIN_SEND, id + CLOSE);
};

function openOne(id) {
    write(PIN_SEND, id + OPEN);
};

function closeAll() {
    var shuttersList = db.shutters.listAllShutters();
    if (shuttersList !== undefined) {
        shuttersList.forEach(function(shutter) {
            closeOne(shutter._id);
            db.shutters.setShutterOpenState(shutter._id, "close");
        });
    }
};

function openAll() {
    var shuttersList = db.shutters.listAllShutters();
    if (shuttersList !== undefined) {
        shuttersList.forEach(function(shutter) {
            openOne(shutter._id);
            db.shutters.setShutterOpenState(shutter._id, "open");
        });
    }
};

Shutter.prototype.closeOne = closeOne;
Shutter.prototype.openOne = openOne;
Shutter.prototype.closeAll = closeAll;
Shutter.prototype.openAll = openAll;

module.exports = Shutter;