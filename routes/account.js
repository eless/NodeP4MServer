/**
 * Created by Eless on 14.04.2015.
 */
var log = require('models/log')(module);
var db = require('models/db');
var activeUser = undefined;
var submitTournament = function() {
    var dbUser = new db.dbUser();
    log.debug('submit to tournament ' + activeUser.id + '... Result:');
    dbUser.addToTournament(activeUser.id, log.debug);
};
exports.router  = function(req, res){
    activeUser = req.user;
    res.render('account', {
        user: activeUser,
        title: 'P4M develop test'
    });
};
exports.events = function(){
    submitTournament();
};