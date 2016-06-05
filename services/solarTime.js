var sunCalc = require('suncalc');
var timezoner = require('timezoner');
var winston = require('winston');
var logger = winston.loggers.get('default');

// services/solarTime.js
function SolarTime() {
}

SolarTime.prototype.getUpTime = function(date, latitude, longitude) {
    // get today's sunlight times for Armentieres
    var times = sunCalc.getTimes(date, latitude, longitude);

    var upHours = 7;
    var upMinutes = 0;

    if (times.sunrise.getHours() > upHours) {
        upHours = times.sunrise.getHours();
        upMinutes = times.sunset.getMinutes();
    }

    date.setHours(upHours);
    date.setMinutes(upMinutes);

    return date;
};

SolarTime.prototype.getDownTime = function(date, latitude, longitude) {
    // get today's sunlight times for Armentieres
    var times = sunCalc.getTimes(date, latitude, longitude);

    var downHours = 21;
    var downMinutes = 0;

    if (times.sunset.getHours() < downHours) {
        downHours = times.sunset.getHours();
        downMinutes = times.sunset.getMinutes();
    }

    date.setHours(downHours);
    date.setMinutes(downMinutes);

    return date;
};

module.exports = SolarTime;