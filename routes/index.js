var log = require('models/log')(module);
var db = require('models/db');
/* GET home page. */
exports.router = function(req, res){
    db.tournaments(function(tournaments){
        log.debug(tournaments);
        res.render('index', { user: req.user,
          tournaments: tournaments,
          title: 'P4M develop test'});
    });
};

