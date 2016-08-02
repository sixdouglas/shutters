var express = require('express');
var router = express.Router();
var winston = require('winston');
var logger = winston.loggers.get('default');

var monitoringService = require("../services/monitoring");

var i18n = require("i18n");
var siteTitle = i18n.__("siteTitle");

function Monitoring() {
}

// ########################################
// ### Monitoring functions
// ########################################

function renderCpu(req, res) {
    logger.info("get.renderCpu()");
    var cpuReturn = monitoringService.cpu();
    res.render('monitoring', {
        cpu : cpuReturn,
        title : siteTitle
    });
}

function renderHeat(req, res) {
    logger.info("get.renderHeat()");
    var heatReturn = monitoringService.heat();
    res.render('monitoring', {
        heat : heatReturn,
        title : siteTitle
    });
}

function renderDisk(req, res) {
    logger.info("get.renderDisk()");
    var diskReturn = monitoringService.disk();
    res.render('monitoring', {
        disk : diskReturn,
        title : siteTitle
    });
}

function renderRam(req, res) {
    logger.info("get.renderRam()");
    var ramReturn = monitoringService.ram();
    res.render('monitoring', {
        ram : ramReturn,
        title : siteTitle
    });
}

function renderEthernet(req, res) {
    logger.info("get.renderEthernet()");
    var ethernetReturn = monitoringService.ethernet();
    res.render('monitoring', {
        ethernet : ethernetReturn,
        title : siteTitle
    });
}

function renderDistribution(req, res) {
    logger.info("get.renderDistribution()");
    var distributionReturn = monitoringService.distribution();
    res.render('monitoring', {
        distribution : distributionReturn,
        title : siteTitle
    });
}

function renderKernel(req, res) {
    logger.info("get.renderKernel()");
    var kernelReturn = monitoringService.kernel();
    res.render('monitoring', {
        kernel : kernelReturn,
        title : siteTitle
    });
}

function renderFirmware(req, res) {
    logger.info("get.renderFirmware()");
    var firmwareReturn = monitoringService.firmware();
    res.render('monitoring', {
        firmware : firmwareReturn,
        title : siteTitle
    });
}

function renderHostname(req, res) {
    logger.info("get.renderHostname()");
    var hostnameReturn = monitoringService.hostname();
    res.render('monitoring', {
        hostname : hostnameReturn,
        title : siteTitle
    });
}

function renderInternalIp(req, res) {
    logger.info("get.renderInternalIp()");
    var internalIpReturn = monitoringService.internalIp();
    res.render('monitoring', {
        internalIp : internalIpReturn,
        title : siteTitle
    });
}

function renderExternalIp(req, res) {
    logger.info("get.renderExternalIp()");
    var externalIpReturn = monitoringService.externalIp();
    res.render('monitoring', {
        externalIp : externalIpReturn,
        title : siteTitle
    });
}

function renderUptime(req, res) {
    logger.info("get.renderUptime()");
    var uptimeReturn = monitoringService.uptime();
    res.render('monitoring', {
        uptime : uptimeReturn,
        title : siteTitle
    });
}

// ########################################
// ### Monitoring routes
// ########################################

router.get('/cpu', require('connect-ensure-login').ensureLoggedIn(), renderCpu);
router.get('/heat', require('connect-ensure-login').ensureLoggedIn(), renderHeat);
router.get('/disk', require('connect-ensure-login').ensureLoggedIn(), renderDisk);
router.get('/ram', require('connect-ensure-login').ensureLoggedIn(), renderRam);
router.get('/ethernet', require('connect-ensure-login').ensureLoggedIn(), renderEthernet);
router.get('/distribution', require('connect-ensure-login').ensureLoggedIn(), renderDistribution);
router.get('/kernel', require('connect-ensure-login').ensureLoggedIn(), renderKernel);
router.get('/firmware', require('connect-ensure-login').ensureLoggedIn(), renderFirmware);
router.get('/hostname', require('connect-ensure-login').ensureLoggedIn(), renderHostname);
router.get('/internalIp', require('connect-ensure-login').ensureLoggedIn(), renderInternalIp);
router.get('/externalIp', require('connect-ensure-login').ensureLoggedIn(), renderExternalIp);
router.get('/uptime', require('connect-ensure-login').ensureLoggedIn(), renderUptime);

module.exports = router;
