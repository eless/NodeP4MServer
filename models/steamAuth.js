var passport = require('passport');
var SteamStrategy = require('passport-steam').Strategy;
var config = require('../config/index');
String.format = function() {
    // The string containing the format items (e.g. "{0}")
    // will and always has to be the first argument.
    var theString = arguments[0];

    // start with the second argument (i = 1)
    for (var i = 1; i < arguments.length; i++) {
        // "gm" = RegEx options for Global search (more than one instance)
        // and for Multiline search
        var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
        theString = theString.replace(regEx, arguments[i]);
    }

    return theString;
}
passport.serializeUser(function(user, done) {
    done(null, user);
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