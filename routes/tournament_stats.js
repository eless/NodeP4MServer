/**
 * Created by Eless on 22.04.2015.
 */
var log = require('models/log')(module);
var db = require('models/db');
var stats = function(req, res) {
    /*db.tournaments(function (tournaments) {
        log.debug(tournaments);
        res.render('index', {
            user: req.user,
            tournaments: tournaments,
            title: 'P4M develop test'
        });
    });*/
    res.render('tournament_stats', {
        name: "Stats",
        description: "Descr",
        title: 'P4M develop test',
        user: req.user
    });
};
exports.router = stats;