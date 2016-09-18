var sunCalc = require('suncalc');
var timezoner = require('timezoner');
var winston = require('winston');
var logger = winston.loggers.get('default');

var config = require('../config/config');

function SolarTime() {
}

function getUpTime(date, latitude, longitude) {
    var times = sunCalc.getTimes(date, latitude, longitude);

    var upHours = config.solarTime.upTimeOffset.hour;
    var upMinutes = config.solarTime.upTimeOffset.minute;

    logger.info("  - Today solar upTime     : " + times.sunrise);

    if (times.sunrise.getHours() > upHours) {
        upHours = times.sunrise.getHours();
        upMinutes = times.sunrise.getMinutes();
    }

    if (times.sunrise.getHours() === upHours && times.sunrise.getMinutes() > upMinutes) {
        upMinutes = times.sunrise.getMinutes();
    }

    date.setHours(upHours);
    date.setMinutes(upMinutes);
    date.setSeconds(times.sunrise.getSeconds());

    return date;
}

function getDownTime(date, latitude, longitude) {
    var times = sunCalc.getTimes(date, latitude, longitude);

    var downHours = config.solarTime.downTimeOffset.hour;
    var downMinutes = config.solarTime.downTimeOffset.minute;

    logger.info("  - Today solar downTime   : " + times.sunset);

    if (times.sunset.getHours() < downHours) {
        downHours = times.sunset.getHours();
        downMinutes = times.sunset.getMinutes();
    }

    if (times.sunset.getHours() === downHours && times.sunset.getMinutes() > downMinutes) {
        downMinutes = times.sunset.getMinutes();
    }

    date.setHours(downHours);
    date.setMinutes(downMinutes);
    date.setSeconds(times.sunset.getSeconds());

    return date;
}

SolarTime.prototype.getUpTime = getUpTime;
SolarTime.prototype.getDownTime = getDownTime;
module.exports = SolarTime;