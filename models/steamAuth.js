var passport = require('passport');
var SteamStrategy = require('passport-steam').Strategy;
var config = require('../config/index');

passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});
passport.use(new SteamStrategy(config.get("steamData"),
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