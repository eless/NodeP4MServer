/**
 * Created by Eless on 22.04.2015.
 */
var log = require('models/log')(module);
var config = require('../config/index');
var db = require('models/db');
var stats = function(req, res) {
    db.currentTournament(req.params.id, function (resp) {
        if(!resp.condition) throw "No condition in tournament"; //TODO
       //db.tournamentStats(resp.condition, function (data) {
            //log.debug("Summary users: " + data.length);
            /*data.forEach(function(column){

            });*/
            res.render('tournament_stats', {
                name: "Stats: ",
                description: "Your mom azaza",
                title: 'P4M develop test',
                tournament_id: req.params.id,
                user: req.user/*,
                data: data*/
            })
        //})
        ;
    });
};
var getStats = function(req, res){
    db.currentTournament(req.params.id, function (resp) {
        if(!resp.condition) throw "No condition in tournament"; //TODO
        db.tournamentStats(resp.condition, function (data) {
            //log.debug("Summary users: " + data.length);
            /*data.forEach(function(column){
            });*/
            res.send(data)
        });
    });
};
exports.router = stats;
exports.getStats = getStats;