var chai = require('chai');
chai.use(require('chai-datetime'));
var expect = chai.expect; // we are using the "expect" style of Chai
var SolarTime = require('./../services/solarTime');
var winston = require('winston');
var logger = winston.loggers.get('default');

describe('SolarTime Sunrise 2016/05/04', function() {
    // **************************
    // ******* 2016/05/04 *******
    // **************************
    // sunrise : 05h49
    it('getUpTime should return 07:00 if date is 2016/06/04 in Armentieres', function() {
        var solarTime = new SolarTime([]);
        var given = solarTime.getUpTime(new Date(2016, 05, 04, 03, 0, 0), 50.6917, 2.8842);
        var expected = new Date(2016, 05, 04, 07, 0, 0);
        expect(given).to.equalDate(expected);
        expect(given).to.equalTime(expected);
    });
});

describe('SolarTime Sunset 2016/05/04', function() {
    // **************************
    // ******* 2016/05/04 *******
    // **************************
    // sunset : 21h48
    it('getDownTime should return 21:00 if date is 2016/06/04 in Armentieres', function() {
        var solarTime = new SolarTime([]);
        var given = solarTime.getDownTime(new Date(2016, 05, 04, 03, 0, 0), 50.6917, 2.8842);
        var expected = new Date(2016, 05, 04, 21, 0, 0);
        expect(given).to.equalTime(expected);
        expect(given).to.equalDate(expected);
    });
});

describe('SolarTime Sunrise 2014/01/05', function() {
    // **************************
    // ******* 2014/01/05 *******
    // **************************
    // sunrise : 08h47
    it('getUpTime should return 08:47 if date is 2014/01/04 in Armentieres', function() {
        var solarTime = new SolarTime([]);
        var given = solarTime.getUpTime(new Date(2014, 01, 05, 03, 0, 0), 50.6917, 2.8842);
        var expected = new Date(2014, 01, 05, 08, 47, 0);
        expect(given).to.equalDate(expected);
        expect(given).to.equalTime(expected);
    });
});

describe('SolarTime Sunset 2014/01/05', function() {
    // **************************
    // ******* 2014/01/05 *******
    // **************************
    // sunset : 17h47
    it('getDownTime should return 17:47 if date is 2014/01/05 in Armentieres', function() {
        var solarTime = new SolarTime([]);
        var given = solarTime.getDownTime(new Date(2014, 01, 05, 03, 0, 0), 50.6917, 2.8842);
        var expected = new Date(2014, 01, 05, 17, 47, 0);
        expect(given).to.equalDate(expected);
        expect(given).to.equalTime(expected);
    });
});