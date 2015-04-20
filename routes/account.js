/**
 * Created by Eless on 14.04.2015.
 */
var log = require('models/log')(module);
var db = require('models/db');
var activeUser = undefined;
var submitTournament = function() {
    var dbUser = new db.dbUser();
    log.debug('submit to tournament ' + activeUser.id + '... Result:');
    dbUser.addToTournament(activeUser.id, null, log.debug);
};
exports.router  = function(req, res){
    activeUser = req.user;
    res.render('account', {
        user: activeUser,
        title: 'P4M develop test'
    });
};
exports.addToTournament = function(req, res, next){

    var tournamentId = req.params.id;
    var currUser = req.user;
    var dbUser = new db.dbUser();
    log.debug('submit to tournament #' + tournamentId+ ' user ' + currUser.id + '... Result:');
    dbUser.addToTournament(currUser.id, tournamentId, function(arg){
        log.debug(arg);
        //TODO надо будет изменить, чтобы не обновлять всю страницу. Надо подумать.
        res.redirect('/');
    });
};
//TODO заглушка, убрать после переноса
// добавления в соревнование из страницы Аккаунта на главную
exports.events = function(){
    submitTournament();
};

