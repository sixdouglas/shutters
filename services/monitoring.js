var winston = require('winston');
var logger = winston.loggers.get('default');
var exec = require('child_process').exec;
var fs = require("fs");

// services/monitoring.js
function Monitoring() {
}

function cpu() {
    var cpuData = {
        current_frequency : 0,
        minimum_frequency : 0,
        maximum_frequency : 0,
        governor : ""
    };

    var data = fs.readFileSync('/sys/devices/system/cpu/cpufreq/policy0/scaling_cur_freq');
    cpuData.current_frequency = Math.round(data / 1000); // Mhz

    data = fs.readFileSync('/sys/devices/system/cpu/cpufreq/policy0/scaling_min_freq');
    cpuData.minimum_frequency = Math.round(data / 1000); // Mhz

    data = fs.readFileSync('/sys/devices/system/cpu/cpufreq/policy0/scaling_max_freq');
    cpuData.maximum_frequency = Math.round(data / 1000); // Mhz

    data = fs.readFileSync('/sys/devices/system/cpu/cpufreq/policy0/scaling_governor');
    cpuData.governor = data; // OnDemand

    return cpuData;
}

function heat() {
    var heatData = {
        degrees : 0,
        label : ""
    };

    var degrees;
    var label;

    var data = fs.readFileSync('/sys/class/thermal/thermal_zone0/temp');
    heatData.degrees = Math.round(data / 1000); // Mhz

    if (heatData.degrees < 55) {
        heatData.label = "label-success";
    } else if (heatData.degrees >= 55 && heatData.degrees < 70) {
        heatData.label = "label-warning";
    } else if (heatData.degrees >= 70) {
        heatData.label = "label-important";
    }

    return heatData;
}

function disks(callback) {
    var child = exec('df -h | grep -vE "tmpfs|rootfs|Filesystem"', function(error, stdout, stderr) {
        if (error !== null) {
            logger.error('exec [df -h | grep -vE "tmpfs|rootfs]: ' + error);
            if (stdout !== undefined) {
                logger.info('    stdout: ' + stdout);
            }
            if (stderr !== undefined) {
                logger.info('    stderr: ' + stderr);
            }
            if (callback !== undefined) {
                callback(error);
            }
        } else {
            var diskDataArray;

            var tabOut = stdout.split("\n");
            for (var i = 0; i < tabOut.length; i++) {
                var tabLine = tabOut[i].split(" ");

                var diskData = {
                    fileSystem : tabLine[0],
                    size : tabLine[1],
                    used : tabLine[2],
                    available : tabLine[3],
                    usedPct : tabLine[4],
                    mountedOn : tabLine[5]
                };

                diskDataArray.push(diskData);
            }

            logger.info('exec [df -h | grep -vE "tmpfs|rootfs]: OK');
            if (stdout !== undefined) {
                logger.info('    stdout: ' + stdout);
            }
            if (stderr !== undefined) {
                logger.info('    stderr: ' + stderr);
            }
            if (callback !== undefined) {
                callback(error, diskDataArray);
            }
        }
    });
}

function ram(callback) {
    var child = exec('free -mo', function(error, stdout, stderr) {
        if (error !== null) {
            logger.error('exec [df -h]: ' + error);
            if (stdout !== undefined) {
                logger.info('    stdout: ' + stdout);
            }
            if (stderr !== undefined) {
                logger.info('    stderr: ' + stderr);
            }
            if (callback !== undefined) {
                callback(error);
            }
        } else {
            var ramDataArray;

            var tabOut = stdout.split("\n");
            for (var i = 1; i < tabOut.length; i++) {
                var tabLine = tabOut[i].split(" ");

                var ramData = {
                    total : tabLine[1],
                    used : tabLine[2],
                    free : tabLine[3],
                    shared : tabLine[4],
                    buffers : tabLine[5],
                    cached : tabLine[6]
                };

                ramDataArray.push(ramData);
            }

            logger.info('exec [df -h]: OK');
            if (stdout !== undefined) {
                logger.info('    stdout: ' + stdout);
            }
            if (stderr !== undefined) {
                logger.info('    stderr: ' + stderr);
            }
            if (callback !== undefined) {
                callback(error, ramDataArray);
            }
        }
    });
}

function connections(callback) {
    var child = exec('netstat -nta --inet', function(error, stdout, stderr) {
        if (error !== null) {
            logger.error('exec [netstat -nta --inet]: ' + error);
            if (stdout !== undefined) {
                logger.info('    stdout: ' + stdout);
            }
            if (stderr !== undefined) {
                logger.info('    stderr: ' + stderr);
            }
            if (callback !== undefined) {
                callback(error);
            }
        } else {
            var netstatDataArray;

            var tabOut = stdout.split("\n");
            for (var i = 1; i < tabOut.length; i++) {
                var tabLine = tabOut[i].split(" ");

                var netstatData = {
                    protocol : tabLine[1],
                    receive : tabLine[2],
                    send : tabLine[3],
                    localAddress : tabLine[4],
                    foreignAddress : tabLine[5],
                    state : tabLine[6]
                };

                netstatDataArray.push(netstatData);
            }

            logger.info('exec [netstat -nta --inet]: OK');
            if (stdout !== undefined) {
                logger.info('    stdout: ' + stdout);
            }
            if (stderr !== undefined) {
                logger.info('    stderr: ' + stderr);
            }
            if (callback !== undefined) {
                callback(stdout, netstatDataArray);
            }
        }
    });
}

function ethernet(callback) {
    var child = exec("/sbin/ifconfig eth0 | grep RX\\bytes | grep -Po '(\([a-zA-Z0-9.\ ]{5,10}\))'", function(error, stdout, stderr) {
        if (error !== null) {
            logger.error("exec [/sbin/ifconfig eth0 | grep RX\\bytes | grep -Po '(\([a-zA-Z0-9.\ ]{5,10}\))']: " + error);
            if (stdout !== undefined) {
                logger.info('    stdout: ' + stdout);
            }
            if (stderr !== undefined) {
                logger.info('    stderr: ' + stderr);
            }
            if (callback !== undefined) {
                callback(error);
            }
        } else {

            var tabOut = stdout.replace("(").replace(")").split("\n");
            var ethernetData = {
                inBytes : tabOut[0],
                outBytes : tabOut[1]
            };

            logger.info("exec [/sbin/ifconfig eth0 | grep RX\\bytes | grep -Po '(\([a-zA-Z0-9.\ ]{5,10}\))']: OK");
            if (stdout !== undefined) {
                logger.info('    stdout: ' + stdout);
            }
            if (stderr !== undefined) {
                logger.info('    stderr: ' + stderr);
            }
            if (callback !== undefined) {
                callback(stdout, ethernetData);
            }
        }
    });
}

function distribution(callback) {
    var child = exec('cat /etc/*-release | grep PRETTY_NAME=', function(error, stdout, stderr) {
        if (error !== null) {
            logger.error('exec [cat /etc/*-release | grep PRETTY_NAME=]: ' + error);
            if (stdout !== undefined) {
                logger.info('    stdout: ' + stdout);
            }
            if (stderr !== undefined) {
                logger.info('    stderr: ' + stderr);
            }
            if (callback !== undefined) {
                callback(error);
            }
        } else {
            var releaseData = {
                name : stdout.split('=')[1]
            };
            logger.info('exec [cat /etc/*-release | grep PRETTY_NAME=]: OK');
            if (stdout !== undefined) {
                logger.info('    stdout: ' + stdout);
            }
            if (stderr !== undefined) {
                logger.info('    stderr: ' + stderr);
            }
            if (callback !== undefined) {
                callback(error, releaseData);
            }
        }
    });
}

function kernel(callback) {
    var child = exec('uname -mrs', function(error, stdout, stderr) {
        if (error !== null) {
            logger.error('exec [uname -mrs]: ' + error);
            if (stdout !== undefined) {
                logger.info('    stdout: ' + stdout);
            }
            if (stderr !== undefined) {
                logger.info('    stderr: ' + stderr);
            }
            if (callback !== undefined) {
                callback(error);
            }
        } else {
            var kernelData = {
                version : stdout
            };
            logger.info('exec [uname -mrs]: OK');
            if (stdout !== undefined) {
                logger.info('    stdout: ' + stdout);
            }
            if (stderr !== undefined) {
                logger.info('    stderr: ' + stderr);
            }
            if (callback !== undefined) {
                callback(error, kernelData);
            }
        }
    });
}

function firmware(callback) {
    var child = exec('uname -v', function(error, stdout, stderr) {
        if (error !== null) {
            logger.error('exec [uname -v]: ' + error);
            if (stdout !== undefined) {
                logger.info('    stdout: ' + stdout);
            }
            if (stderr !== undefined) {
                logger.info('    stderr: ' + stderr);
            }
            if (callback !== undefined) {
                callback(error);
            }
        } else {
            var firmwareData = {
                version : stdout
            };
            logger.info('exec [uname -v]: OK');
            if (stdout !== undefined) {
                logger.info('    stdout: ' + stdout);
            }
            if (stderr !== undefined) {
                logger.info('    stderr: ' + stderr);
            }
            if (callback !== undefined) {
                callback(error, firmwareData);
            }
        }
    });
}

function hostname(callback) {
    var child = exec('hostname -f', function(error, stdout, stderr) {
        if (error !== null) {
            logger.error('exec [hostname -f]: ' + error);
            if (stdout !== undefined) {
                logger.info('    stdout: ' + stdout);
            }
            if (stderr !== undefined) {
                logger.info('    stderr: ' + stderr);
            }
            if (callback !== undefined) {
                callback(error);
            }
        } else {
            var hostnameData = {
                name : stdout
            };
            logger.info('exec [hostname -f]: OK');
            if (stdout !== undefined) {
                logger.info('    stdout: ' + stdout);
            }
            if (stderr !== undefined) {
                logger.info('    stderr: ' + stderr);
            }
            if (callback !== undefined) {
                callback(error, hostnameData);
            }
        }
    });
}

function services(callback) {
    var child = exec('service --status-all', function(error, stdout, stderr) {
        if (error !== null) {
            logger.error('exec [service --status-all]: ' + error);
            if (stdout !== undefined) {
                logger.info('    stdout: ' + stdout);
            }
            if (stderr !== undefined) {
                logger.info('    stderr: ' + stderr);
            }
            if (callback !== undefined) {
                callback(error);
            }
        } else {
            logger.info('exec [service --status-all]: OK');
            if (stdout !== undefined) {
                logger.info('    stdout: ' + stdout);
            }
            if (stderr !== undefined) {
                logger.info('    stderr: ' + stderr);
            }
            if (callback !== undefined) {
                callback(error, stdout);
            }
        }
    });
}

function internalIp(callback) {
    var child = exec("ifconfig eth0 | grep 'inet addr:' | grep -Po '((?:[0-9]{1,3}\.){3}[0-9]{1,3})'", function(error, stdout, stderr) {
        if (error !== null) {
            logger.error("exec [ifconfig eth0 | grep 'inet addr:' | grep -Po '((?:[0-9]{1,3}\.){3}[0-9]{1,3})']: " + error);
            if (stdout !== undefined) {
                logger.info('    stdout: ' + stdout);
            }
            if (stderr !== undefined) {
                logger.info('    stderr: ' + stderr);
            }
            if (callback !== undefined) {
                callback(error);
            }
        } else {
            var tabData = stdout.split('\n');
            var internalIpData = {
                inetAddress : tabData[0],
                broadcast : tabData[1],
                mask : tabData[2]
            }
            logger.info("exec [ifconfig eth0 | grep 'inet addr:' | grep -Po '((?:[0-9]{1,3}\.){3}[0-9]{1,3})']: OK");
            if (stdout !== undefined) {
                logger.info('    stdout: ' + stdout);
            }
            if (stderr !== undefined) {
                logger.info('    stderr: ' + stderr);
            }
            if (callback !== undefined) {
                callback(error, internalIpData);
            }
        }
    });
}

function externalIp(callback) {
    var child = exec('curl http://whatismyip.akamai.com', function(error, stdout, stderr) {
        if (error !== null) {
            logger.error('exec [curl http://whatismyip.akamai.com]: ' + error);
            if (stdout !== undefined) {
                logger.info('    stdout: ' + stdout);
            }
            if (stderr !== undefined) {
                logger.info('    stderr: ' + stderr);
            }
            if (callback !== undefined) {
                callback(error);
            }
        } else {
            logger.info('exec [curl http://whatismyip.akamai.com]: OK');
            if (stdout !== undefined) {
                logger.info('    stdout: ' + stdout);
            }
            if (stderr !== undefined) {
                logger.info('    stderr: ' + stderr);
            }
            if (callback !== undefined) {
                callback(error, stdout);
            }
        }
    });
}

function uptime(callback) {
    var child = exec('uptime', function(error, stdout, stderr) {
        if (error !== null) {
            logger.error('exec [uptime]: ' + error);
            if (stdout !== undefined) {
                logger.info('    stdout: ' + stdout);
            }
            if (stderr !== undefined) {
                logger.info('    stderr: ' + stderr);
            }
            if (callback !== undefined) {
                callback(error);
            }
        } else {
            logger.info('exec [uptime]: OK');
            if (stdout !== undefined) {
                logger.info('    stdout: ' + stdout);
            }
            if (stderr !== undefined) {
                logger.info('    stderr: ' + stderr);
            }
            if (callback !== undefined) {
                callback(error, stdout);
            }
        }
    });
}

Monitoring.prototype.cpu = cpu;
Monitoring.prototype.heat = heat;
Monitoring.prototype.disks = disks;
Monitoring.prototype.ram = ram;
Monitoring.prototype.connections = connections;
Monitoring.prototype.ethernet = ethernet;
Monitoring.prototype.distribution = distribution;
Monitoring.prototype.kernel = kernel;
Monitoring.prototype.firmware = firmware;
Monitoring.prototype.hostname = hostname;
Monitoring.prototype.services = services;
Monitoring.prototype.internalIp = internalIp;
Monitoring.prototype.externalIp = externalIp;
Monitoring.prototype.uptime = uptime;

module.exports = Monitoring;