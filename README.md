Shutters
====

**Shutters** is a NodeJS project that I've created to command my home shutters from the Web. It's a responsive web application based on Twitter Bootstrap CSS Framework.

At home, I have motorized shutters using the DI-O by Chancon protocol. Has the protocol is quit simple, and the box they sale is quite expensive, I would like to create something using my Raspberry PI to command those shutters. So first, I made this Web App. Then I will create a scheduler to raise or lower them according to the sun rise and sun set...

## Usage

When used from a mobile, you can only send the command to raise or lower your shutters. When used from a laptop you can add, edit, remove shutters and modify the user information (name, email address, login and password).

## Developing

Actually all the job is done in the /routes/shutters.js function *renderAction*. Well it doesn't do anything but that is the place where you are supposed to call the external program to actually do the stuff.

For the list of shutters and the user, I'm using the [NeDB](https://github.com/louischatriot/nedb). This is a Mongo like in-memory database. The DB content is saved on the HDD in the db directory.

The web framework is [Express](https://github.com/expressjs/express) using Jade templating format.

The password is encrypted using [Password-Hash](https://github.com/davidwood/password-hash).

The authentication is made using [Passport](https://github.com/jaredhanson/passport) and [Passport-local](https://github.com/jaredhanson/passport-local).

## Setup

In order to make this work, follow these steps:

1. `npm install` to download the dependencies
2. update the user setting in the db/database.js more specifically the content of the user object: 
```
    var hashed = passwordHash.generate('six');
    dbs.users.insert([ {
        username : 'douglas',
        password : hashed,
        displayName : 'Douglas SIX',
        email : 'six.douglas@gmail.com'
    }
```
3. update the shutters settings in the db/database.js:
```
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
    }
```

### Tools

Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

Nodeclipse is free open-source project that grows with your contributions.
