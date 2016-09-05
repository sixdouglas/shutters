var express = require('express');
var router = express.Router();
var winston = require('winston');
var logger = winston.loggers.get('default');

var monitoringService = require("../services/monitoring");

var i18n = require("i18n");
var siteTitle = i18n.__("siteTitle");

var config = require('../config/config');

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
        title : siteTitle,
        contextPath : config.webApp.rootPath
    });
}

function renderHeat(req, res) {
    logger.info("get.renderHeat()");
    var heatReturn = monitoringService.heat();
    res.render('monitoring', {
        data : heatReturn,
        title : siteTitle,
        contextPath : config.webApp.rootPath
    });
}

function renderDisk(req, res) {
    logger.info("get.renderDisk()");
    var diskReturn = monitoringService.disk();
    res.render('monitoring', {
        data : diskReturn,
        title : siteTitle,
        contextPath : config.webApp.rootPath
    });
}

function renderRam(req, res) {
    logger.info("get.renderRam()");
    var ramReturn = monitoringService.ram();
    res.render('monitoring', {
        data : ramReturn,
        title : siteTitle,
        contextPath : config.webApp.rootPath
    });
}

function renderEthernet(req, res) {
    logger.info("get.renderEthernet()");
    var ethernetReturn = monitoringService.ethernet();
    res.render('monitoring', {
        data : ethernetReturn,
        title : siteTitle,
        contextPath : config.webApp.rootPath
    });
}

function renderDistribution(req, res) {
    logger.info("get.renderDistribution()");
    var distributionReturn = monitoringService.distribution();
    res.render('monitoring', {
        data : distributionReturn,
        title : siteTitle,
        contextPath : config.webApp.rootPath
    });
}

function renderKernel(req, res) {
    logger.info("get.renderKernel()");
    var kernelReturn = monitoringService.kernel();
    res.render('monitoring', {
        data : kernelReturn,
        title : siteTitle,
        contextPath : config.webApp.rootPath
    });
}

function renderFirmware(req, res) {
    logger.info("get.renderFirmware()");
    var firmwareReturn = monitoringService.firmware();
    res.render('monitoring', {
        data : firmwareReturn,
        title : siteTitle,
        contextPath : config.webApp.rootPath
    });
}

function renderHostname(req, res) {
    logger.info("get.renderHostname()");
    var hostnameReturn = monitoringService.hostname();
    res.render('monitoring', {
        data : hostnameReturn,
        title : siteTitle,
        contextPath : config.webApp.rootPath
    });
}

function renderInternalIp(req, res) {
    logger.info("get.renderInternalIp()");
    var internalIpReturn = monitoringService.internalIp();
    res.render('monitoring', {
        data : internalIpReturn,
        title : siteTitle,
        contextPath : config.webApp.rootPath
    });
}

function renderExternalIp(req, res) {
    logger.info("get.renderExternalIp()");
    var externalIpReturn = monitoringService.externalIp();
    res.render('monitoring', {
        data : externalIpReturn,
        title : siteTitle,
        contextPath : config.webApp.rootPath
    });
}

function renderUptime(req, res) {
    logger.info("get.renderUptime()");
    var uptimeReturn = monitoringService.uptime();
    res.render('monitoring', {
        data : uptimeReturn,
        title : siteTitle,
        contextPath : config.webApp.rootPath
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
