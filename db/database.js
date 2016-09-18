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

exports.users = new Datastore({
    filename : 'db/users.db',
    autoload : true
});

exports.shutters = new Datastore({
    filename : 'db/shutters.db',
    autoload : true
});
