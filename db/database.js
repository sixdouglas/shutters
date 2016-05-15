var winston = require('winston');
var logger = winston.loggers.get('default');

// ########################################
// ### Database Configuration ###
// ########################################

// Persistent datastore with automatic loading
var Datastore = require('nedb');

var fs = require('fs');

// Of course you can create multiple datastores if you need several
// collections. In this case it's usually a good idea to use autoload for all
// collections.
var dbs = {};

// The user data file didn't exists so this is the first time
// the DB is loaded so let's fill it with the default data
function initUsers() {
    logger.info('  init UserDB');
    var passwordHash = require('password-hash');
    var hashed = passwordHash.generate('six');
    dbs.users.insert([ {
        username : 'douglas',
        password : hashed,
        displayName : 'Douglas SIX',
        email : 'six.douglas@gmail.com'
    } ], function(err, newDocs) {
        // One document was inserted in the database
        // newDocs is an array with this document, augmented with its _id
    });
}

dbs.users = new Datastore({
    filename : 'db/users.db',
    autoload : true
});

// Make it available from outside this module
exports.users = dbs.users;

// initUsers();

// The shutter data file didn't exists so this is the first time
// the DB is loaded so let's fill it with the default data
function initShutters() {
    logger.info('  init ShutterDB');
    dbs.shutters.insert([ {
        name : 'LivingRoom',
        displayName : 'Living room',
        remoteControlKey : 456123,
        open : true
    }, {
        name : 'DiningRoom',
        displayName : 'Dining room',
        remoteControlKey : 123456,
        open : false
    } ], function(err, newDocs) {
        // Two documents were inserted in the database
        // newDocs is an array with these documents, augmented with their _id
    });
}

dbs.shutters = new Datastore({
    filename : 'db/shutters.db',
    autoload : true
});

// Make it available from outside this module
exports.shutters = dbs.shutters;

// initShutters();
