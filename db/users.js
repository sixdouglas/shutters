var database = require('./database');
var logger = require('../utils').logger.main;
var bcrypt = require('bcrypt');
const saltRounds = 10;

// ########################################
// ### User DB functions
// ########################################

exports.findUserById = function(id, cb) {
    process.nextTick(function() {
        database.users.findOne({
            _id : id
        }, function(err, doc) {
            if (doc) {
                return cb(null, doc);
            } else {
                return cb(new Error('User ' + id + ' does not exist.'));
            }
        });
    });
};

exports.findByUsername = function(username, cb) {
    process.nextTick(function() {
        database.users.findOne({
            username : username
        }, function(err, doc) {
            if (doc) {
                return cb(null, doc);
            } else {
                logger.error('User "' + username + '", not found.');
                return cb(new Error('User "' + username + '", not found.'));
            }
        });
    });
};

exports.update = function(id, username, displayName, email, hashed, cb) {
    logger.info('update(User): ' + id + ', username: ' + username);
    database.users.update({
        _id : id
    }, {
        $set : {
            username : username,
            displayName : displayName,
            email : email,
            password : hashed
        }
    }, {
        returnUpdatedDocs : true,
        multi : false,
        upsert : true
    }, function(err, numReplaced, doc) {
        if (numReplaced === 1) {
            logger.info('User: ' + doc._id + ', displayName: ' + doc.displayName + ", username: " + doc.username);
            if (cb !== undefined && cb !== null) {
                cb(null, doc);
            }
        } else {
            logger.info('User "' + id + '", not updated.');
            if (cb !== undefined && cb !== null) {
                cb(new Error('User "' + id + '", not updated.'));
            }
        }
    });
};

exports.insert = function(username, displayName, email, hashed, cb) {
    logger.info('insert(User): username: ' + username);
    database.users.insert({
        username : username,
        displayName : displayName,
        email : email,
        password : hashed
    }, function(err, doc) {
        if ((err === undefined || err === null)) {
            logger.info('User: ' + doc._id + ', displayName: ' + doc.displayName + ", username: " + doc.username);
            if (cb !== undefined && cb !== null) {
                cb(null, doc);
            }
        } else {
            logger.info('User "' + username + '", not created.');
            if (cb !== undefined && cb !== null) {
                cb(new Error('User "' + username + '", not created.'));
            }
        }
    });
};
