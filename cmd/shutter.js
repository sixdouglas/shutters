var winston = require('winston');
var logger = winston.loggers.get('default');
var exec = require('child_process').exec;

// services/shutter.js
function Shutter() {
}

Shutter.prototype.closeAll = function() {
    var child = exec('dir *.js', function(error, stdout, stderr) {
        if (error !== null) {
            logger.info('exec error: #{error}');
        } else {
            logger.info('exec stdout: #{stdout}');
        }
    });
}

Shutter.prototype.openAll = function() {
    var child = exec('dir *.js', function(error, stdout, stderr) {
        if (error !== null) {
            logger.info('exec error: #{error}');
        } else {
            logger.info('exec stdout: #{stdout}');
        }
    });
}

Shutter.prototype.closeOne = function(id) {
    var child = exec('dir *.js', function(error, stdout, stderr) {
        if (error !== null) {
            logger.info('exec error: #{error}');
        } else {
            logger.info('exec stdout: #{stdout}');
        }
    });
}

Shutter.prototype.openOne = function(id) {
    var child = exec('dir *.js', function(error, stdout, stderr) {
        if (error !== null) {
            logger.info('exec error: #{error}');
        } else {
            logger.info('exec stdout: #{stdout}');
        }
    });
}

module.exports = Shutter;