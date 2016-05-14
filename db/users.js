var database = require('./database');
var winston = require('winston');
var passwordHash = require('password-hash');
var logger = winston.loggers.get('default');

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

exports.update = function(id, username, displayName, email, password, cb) {
    logger.info('update(User): ' + id + ', username: ' + username);
    var hashed = password;
    if (!passwordHash.isHashed(password)) {
        hashed = passwordHash.generate(password);
    }
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
        upsert : false
    }, function(err, numReplaced, doc) {
        if (numReplaced === 1) {
            logger.info('User: ' + doc._id + ', displayName: ' + doc.displayName + ", username: " + doc.username);
            cb(null, doc);
        } else {
            logger.info('User "' + id + '", not updated.');
            cb(new Error('User "' + id + '", not updated.'));
        }
    });
};
