/**
 * Created by Eless on 14.04.2015.
 */
exports.router = function(req, res) {
    var dbUser = new db.dbUser();
    log.debug('selectUser ' + req.params.id + '... Result:');
    dbUser.selectUser(req.params.id, function (user) {
        log.debug(user);
        if (user && user.steam_id) {
            res.render('profile', {
                user: {
                    id: user.steam_id,
                    displayName: user.steam_name,
                    logo: user.logo
                }
            });
        } else {
            res.render('error', {
                message: 'User id = ' + req.params.id + ' is not defined in p4m base',
                error: undefined
            });
        }
    });
};