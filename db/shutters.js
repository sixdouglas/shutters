var database = require('./database');
var logger = require('../utils').logger.main;

// ########################################
// ### Shutters DB functions
// ########################################

exports.findShutterById = function(id, cb) {
    logger.info('findShutterById(ShutterId): ' + id);
    database.shutters.findOne({
        _id : id
    }, function(err, doc) {
        if (doc) {
            logger.info('Shutter: ' + doc.remoteControlKey);
            if (cb !== undefined && cb !== null) {
                cb(null, doc);
            }
        } else {
            logger.info('Shutter "' + id + '", not found.');
            if (cb !== undefined && cb !== null) {
                cb(null, null);
            }
        }
    });
};

exports.removeShutterById = function(id, cb) {
    logger.info('removeShutterById(ShutterId): ' + id);
    database.shutters.remove({
        _id : id
    }, function(err) {
        if (err !== null) {
            logger.info('Shutter: ' + id + " removed");
            if (cb !== undefined && cb !== null) {
                cb(null);
            }
        } else {
            logger.error('Shutter "' + id + '", not removed.');
            if (cb !== undefined && cb !== null) {
                cb(err);
            }
        }
    });
};

exports.findByShutterName = function(shutterName, cb) {
    logger.info('findByShutterName(ShutterName): ' + shutterName);
    database.shutters.findOne({
        name : shutterName
    }, function(err, doc) {
        if (doc) {
            if (cb !== undefined && cb !== null) {
                cb(null, doc);
            }
        } else {
            logger.info('Shutter "' + shutterName + '", not found.');
            if (cb !== undefined && cb !== null) {
                cb(null, null);
            }
        }
    });
};

exports.update = function(id, name, displayName, remoteControlKey, state, cb) {
    logger.info('update(Shutter): ' + id + ', state: ' + state);
    database.shutters.update({
        _id : id
    }, {
        $set : {
            name : name,
            displayName : displayName,
            remoteControlKey : remoteControlKey,
            open : state
        }
    }, {
        returnUpdatedDocs : true,
        multi : false,
        upsert : true
    }, function(err, numReplaced, doc) {
        if (numReplaced === 1) {
            logger.info('Shutter: ' + doc._id + ', displayName: ' + doc.displayName + ", open: " + doc.open);
            if (cb !== undefined && cb !== null) {
                cb(null, doc);
            }
        } else {
            logger.info('Shutter "' + id + '", not updated.');
            if (cb !== undefined && cb !== null) {
                cb(new Error('Shutter "' + id + '", not updated.'));
            }
        }
    });

};

exports.insert = function(name, displayName, remoteControlKey, state, cb) {
    logger.info('insert(Shutter): ' + displayName + ', state: ' + state);
    database.shutters.insert({
        name : name,
        displayName : displayName,
        remoteControlKey : remoteControlKey,
        open : state
    }, function(err, doc) {
        if ((err === undefined || err === null)) {
            logger.info('Shutter: ' + doc._id + ', displayName: ' + doc.displayName + ", open: " + doc.open);
            if (cb !== undefined && cb !== null) {
                cb(null, doc);
            }
        } else {
            logger.info('Shutter "' + displayName + '", not created.');
            if (cb !== undefined && cb !== null) {
                cb(new Error('Shutter "' + displayName + '", not created.'));
            }
        }
    });

};

exports.setShutterOpenState = function(id, action, cb) {
    logger.info('setShutterOpenState(Shutter): ' + id + ', action: ' + action);
    database.shutters.update({
        _id : id
    }, {
        $set : {
            open : action === "open"
        }
    }, {
        returnUpdatedDocs : true,
        multi : false
    }, function(err, numReplaced, doc) {
        if (numReplaced === 1) {
            logger.info('Shutter: ' + doc._id + ', displayName: ' + doc.displayName + ", open: " + doc.open);
            if (cb !== undefined && cb !== null) {
                cb(null, doc);
            }
        } else {
            logger.info('Shutter "' + id + '", not updated.');
            if (cb !== undefined && cb !== null) {
                cb(new Error('Shutter "' + id + '", not updated.'));
            }
        }
    });

};

/**
 * Function to list all Shutters.
 * 
 * @return shutter array
 */
exports.listAllShutters = function() {
    logger.info('listAllShutters()');
    return database.shutters.getAllData();
};