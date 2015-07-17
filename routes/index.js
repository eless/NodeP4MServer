var log = require('models/log')(module);
var db = require('models/db');
/* GET home page. */
exports.router = function(req, res){
    res.render('index', { user: req.user,
      title: 'P4M develop test'});
};
exports.tournaments = function(req, res){
    db.tournaments(function(tournaments){
        log.debug(tournaments);
        res.send ({ user: req.user,
            tournaments: tournaments
        });
    });
};

