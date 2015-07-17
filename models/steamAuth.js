var passport = require('passport');
var SteamStrategy = require('passport-steam').Strategy;
var config = require('../config/index');
var db = require('models/db');
var log = require('models/log')(module);
String.format = function() {
    var theString = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
        theString = theString.replace(regEx, arguments[i]);
    }
    return theString;
};
passport.serializeUser(function(user, done) {
    var dbUser = db.dbUser;
    var currentUser = user;
    log.debug('upsertUser ' + user.displayName + '... Result:');
    dbUser.upsertUser(user, function(res){
        log.debug(res);
        dbUser.account_Id(user.id, function(getUser){
            currentUser.account_Id = getUser.account_id;
            dbUser.isAdmin(currentUser.account_Id, function(isAdmin){
                log.debug('User is admin: ' + isAdmin);
                currentUser.isAdmin = isAdmin;
                done(null, currentUser);
            });
        })
    });
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});
passport.use(new SteamStrategy(
    {
        "returnURL": process.env.NODE_ENV == 'development' ? String.format("http://localhost:{0}/auth/steam/return", process.env.PORT || config.get('port'))
                                                : process.env.URL + "auth/steam/return",
        "realm": process.env.NODE_ENV == 'development' ? String.format("http://localhost:{0}/", process.env.PORT || config.get('port'))
                                                : process.env.URL,
        "apiKey": "691ECE9B5791CB26E7BBDDB192E5EB99"
    },
    function(identifier, profile, done) {
// asynchronous verification, for effect...
        process.nextTick(function () {
// To keep the example simple, the user's Steam profile is returned to
// represent the logged-in user. In a typical application, you would want
// to associate the Steam account with a user record in your database,
// and return that user instead.
            profile.identifier = identifier;
            return done(null, profile);
        });
    }
));

module.exports = passport;