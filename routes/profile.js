/**
 * Created by Eless on 14.04.2015.
 */
var log = require('models/log')(module);
var db = require('models/db');
exports.router = function(req, res) {
    var dbUser = new db.dbUser();
    log.debug('selectUser ' + req.params.id + '... Result:');
    dbUser.selectUser(req.params.id, function (user) {
        log.debug(user);
        if (user && user.account_id) {
            res.render('profile', {
                user: {
                    id: user.account_id,
                    displayName: user.steam_name,
                    logo: user.logo
                },
                title: 'P4M develop test'
            });
        } else {
            res.render('error', {
                message: 'User id = ' + req.params.id + ' is not defined in p4m base',
                error: undefined,
                title: 'P4M develop test'
            });
        }
    });
};