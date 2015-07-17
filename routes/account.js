/**
 * Created by Eless on 14.04.2015.
 */
var log = require('models/log')(module);
var db = require('models/db');
exports.router  = function(req, res){
    res.render('account', {
        user: req.user,
        title: 'P4M develop test'
    });
};
exports.addToTournament = function(req){
    var tournamentId = req.data[0];
    var currUser = req.data[1];
    var dbUser = db.dbUser;
    log.debug('submit to tournament #' + tournamentId+ ' user ' + currUser + '... Result:');
    dbUser.addToTournament(currUser, tournamentId, function(arg){
        log.debug(arg);
        db.getUsersCount(tournamentId, function(count){
            req.io.emit('currentUsersInTournament', {   id: req.data[0],
                count: count
            })
        })

    });
};
