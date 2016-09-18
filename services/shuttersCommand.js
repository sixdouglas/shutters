var winston = require('winston');
var logger = winston.loggers.get('default');
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var db = require('../db');

var schedule = require('node-schedule');
var SolarTime = require('./solarTime');
var solarTime = new SolarTime([]);

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
            //            if (stdout !== undefined) {
            //                logger.info('    stdout: ' + stdout);
            //            }
            //            if (stderr !== undefined) {
            //                logger.info('    stderr: ' + stderr);
            //            }
            if (callback !== undefined) {
                callback();
            }
        }
    });
}

function writeSync(value, state, callback) {
    var action;
    if (state === OPEN) {
        logger.info("opening: " + value);
        action = "on";
    } else {
        logger.info("closing: " + value);
        action = "off";
    }

    try {
        var returnValue = execSync(config.shuttersCommand.programPath + ' ' + config.shuttersCommand.gpioPin + ' ' + value + ' ' + action);
        if (callback !== undefined) {
            callback();
        }
    } catch (error) {
        logger.error('execSync [' + config.shuttersCommand.programPath + ' ' + config.shuttersCommand.gpioPin + ' ' + value + ' ' + action + ']: ' + error);
    }

    /*function(error, stdout, stderr) {
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
            //            if (stdout !== undefined) {
            //                logger.info('    stdout: ' + stdout);
            //            }
            //            if (stderr !== undefined) {
            //                logger.info('    stderr: ' + stderr);
            //            }
            if (callback !== undefined) {
                callback();
            }
        }
    });*/
}

function closeOne(key) {
    write(key, CLOSE);
}

function openOne(key) {
    write(key, OPEN);
}

function closeOneSync(key) {
    writeSync(key, CLOSE);
}

function openOneSync(key) {
    writeSync(key, OPEN);
}

function wait(timespan) {
    var startTime = new Date().getTime();
    var nowTime = new Date().getTime();
    while ((nowTime - startTime) < timespan) {
        nowTime = new Date().getTime();
    }
}

function closeAll() {
    var shuttersList = db.shutters.listAllShutters();
    if (shuttersList !== undefined) {
        for (var cpt = 0; cpt < shuttersList.length; cpt++) {
            var shutter = shuttersList[cpt];
            logger.info("closing: " + cpt);
            closeOneSync(shutter.remoteControlKey);
            wait(3000);
            db.shutters.setShutterOpenState(shutter._id, "close");
        }
    }
}

function openAll() {
    var shuttersList = db.shutters.listAllShutters();
    if (shuttersList !== undefined) {
        for (var cpt = 0; cpt < shuttersList.length; cpt++) {
            var shutter = shuttersList[cpt];
            logger.info("opening: " + cpt);
            openOneSync(shutter.remoteControlKey);
            wait(3000);
            db.shutters.setShutterOpenState(shutter._id, "open");
        }
    }
}

function scheduleShutters() {
    var upTime = solarTime.getUpTime(new Date(), config.latitude, config.longitude);
    var downTime = solarTime.getDownTime(new Date(), config.latitude, config.longitude);

    logger.info("    Today shutters upTime: " + upTime);
    schedule.scheduleJob(upTime, openAll);

    logger.info("    Today shutters downTime: " + downTime);
    schedule.scheduleJob(downTime, closeAll);
}

Shutter.prototype.scheduleShutters = scheduleShutters;
Shutter.prototype.closeOne = closeOne;
Shutter.prototype.openOne = openOne;
//Shutter.prototype.closeAll = closeAll;
//Shutter.prototype.openAll = openAll;

module.exports = Shutter;