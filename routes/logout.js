/**
 * Created by Eless on 14.04.2015.
 */
exports.router = function(req, res){
    req.logout();
    res.redirect('/');
};