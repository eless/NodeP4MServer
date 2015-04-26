/**
 * Created by Eless on 14.04.2015.
 */
var log = require('models/log')(module);
var db = require('models/db');
var activeUser = undefined;
exports.router  = function(req, res){
    activeUser = req.user;
    res.render('account', {
        user: activeUser,
        title: 'P4M develop test'
    });
};
exports.addToTournament = function(data){
    var tournamentId = data.data[0];
    var currUser = data.data[1];
    var dbUser = new db.dbUser();
    log.debug('submit to tournament #' + tournamentId+ ' user ' + currUser + '... Result:');
    dbUser.addToTournament(currUser, tournamentId, function(arg){
        log.debug(arg);
    });
};
