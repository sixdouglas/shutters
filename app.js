'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var config = require('./config/config');

// ########################################
// ### Application Translation ###
// ########################################

var i18n = require("i18n");

i18n.configure({
    locales : [ 'en', 'fr' ],
    directory : __dirname + '/locales',
    cookie : 'shuttersLocale',
    objectNotation : true
});

// ########################################
// ### Application logging ###
// ########################################

var winston = require('winston');

// setup default logger (no category)
winston.loggers.add('default', {
    console : {
        colorize : 'true',
        handleExceptions : true,
        json : false,
        level : 'silly',
        label : 'default',
        timestamp : true
    }
});

var logger = winston.loggers.get('default');

// ########################################
// ### Scheduling ###
// ########################################
var schedule = require('node-schedule');

var Shutter = require("./services/shuttersCommand");
var shutterCmd = new Shutter();

// Every days at 1 AM recalculate the today's up and down time
var rule = new schedule.RecurrenceRule();
// hour is set to 3:30 to avoid problems with day saving light changes
// (remain in the same day and no minute overlaps)
rule.hour = config.daySetupScheduler.hour;
rule.minute = config.daySetupScheduler.minute;

logger.info("Everyday scheduler rule: ", rule);

schedule.scheduleJob(rule, shutterCmd.scheduleShutters);

// Call the function for the first time to set things up for the current day.
var newScheduleTime = new Date(new Date().getTime() + 5000);
schedule.scheduleJob(newScheduleTime, shutterCmd.scheduleShutters);

// ########################################
// ### Request logging ###
// ########################################
var morgan = require('morgan');

// ########################################
// ### Database Configuration ###
// ########################################
var db = require('./db');

// ########################################
// ### Passport Authentication ###
// ########################################
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var passwordHash = require('password-hash');

// Configure the local strategy for use by Passport.

// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user. The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy(function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
        if (err) {
            logger.error(err);
            return cb(err);
        }
        if (!user) {
            logger.info("Username: " + username + ", not right user.");
            return cb(null, false);
        }
        logger.info("Username: " + username + ", password: " + user.password + ", hashed: " + password + ", isHashed: " + passwordHash.isHashed(password) + ", verify: "
                + passwordHash.verify(password, user.password) + ", generate: " + passwordHash.generate(password));
        if ((passwordHash.isHashed(user.password) && !passwordHash.verify(password, user.password)) || (!passwordHash.isHashed(user.password) && password !== user.password)) {
            logger.info("Username: " + username + ", not right password.");
            return cb(null, false);
        }
        logger.debug("Username: " + username + ", everything is fine.");
        return cb(null, user);
    });
}));

// Configure Passport authenticated session persistence.

// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session. The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
    cb(null, user._id);
});

passport.deserializeUser(function(id, cb) {
    db.users.findUserById(id, function(err, user) {
        if (err) {
            return cb(err);
        }
        cb(null, user);
    });
});

// ########################################
// ### Express Configuration ###
// ########################################

var routes = require('./routes/index');
var users = require('./routes/users');
var shutters = require('./routes/shutters');
var monitoring = require('./routes/monitoring');

var app = express();

app.use(i18n.init);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, '/public/', 'favicon.ico')));

// set logging format
// app.use(morgan(':remote-addr :remote-user [:date[iso]] :status :response-time
// :method :url'));
app.use(morgan(':status :response-time :method :url'));

// Session settings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended : true
}));
app.use(cookieParser('secret'));
app.use(express.static(path.join(__dirname, 'public')));

var session = require('express-session');
var sessionStore = new session.MemoryStore();

app.use(session({
    secret : 'secret',
    resave : true,
    store : sessionStore,
    saveUninitialized : true,
    cookie : {
        maxAge : 600000
    }
}));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/users', users);
app.use('/shutters', shutters);
app.use('/monitoring', monitoring);
app.use(express.static('public'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found [' + req.originalUrl + ']');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        var localConfig = require('./config/config');
        res.status(err.status || 500);
        res.render('error', {
            message : err.message,
            error : err,
            contextPath : config.webApp.rootPath
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    var localConfig = require('./config/config');
    res.status(err.status || 500);
    res.render('error', {
        message : err.message,
        error : {},
        contextPath : config.webApp.rootPath
    });
});

module.exports = app;
