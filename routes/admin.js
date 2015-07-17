/**
 * Created by Eless on 19.06.2015.
 */
var log = require('models/log')(module);
var db = require('models/db');
exports.router  = function(req, res){
    res.render('adminPage', {
        user: req.user,
        title: 'P4M develop test admin'
    });
};