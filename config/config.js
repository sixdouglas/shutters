var config = {
    webApp : {
        rootPath : ""
    },
    longitude : 2.8842,
    latitude : 50.6917,
    daySetupScheduler : {
        hour : 3,
        minute : 30
    },
    solarTime : {
        upTimeOffset : {
            hour : 7,
            minute : 0
        },
        downTimeOffset : {
            hour : 21,
            minute : 0
        }
    },
    shuttersCommand : {
        gpioPin : 17,
        programPath : 'java -cp /opt/chaconPi4j/lib/pi4j-core-1.1.jar -jar /opt/chaconPi4j/bin/chaconPi4j-1.0.jar'
    }
};

module.exports = config;