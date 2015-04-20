var log = require('models/log')(module);
var db = require('models/db');

exports.getTournaments = db.tournaments;