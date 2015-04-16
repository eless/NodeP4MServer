/**
 * Created by Eless on 14.04.2015.
 */
var log = require('models/log')(module);
var db = require('models/db');
var user = {};
var submitTournament = function() {
    var dbUser = new db.dbUser();
    log.debug('submit to tournament ' + user.id + '... Result:');
    dbUser.addToTournament(user.id, log.debug);
    console.log(user.id);
};
exports.router  = function(req, res){
    user = req.user;
    res.render('account', {
        user: user,
        title: 'P4M develop test'
    });
};
exports.events = function(){
    submitTournament();
};