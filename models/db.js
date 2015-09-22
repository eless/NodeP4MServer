/**
 * Created by Eless on 30.03.2015.
 */
var mysql = require('mysql');
var config = require('../config/index');
var mysqlUtilities = require('mysql-utilities');
var log = require('models/log')(module);
var connection = mysql.createConnection(process.env.NODE_ENV == 'development' ? config.get('dbConfig')
                                                        :
                                                            {
                                                                "host": process.env.DB_HOST,
                                                                "port": process.env.DB_PORT,
                                                                "user": process.env.DB_LOGIN,
                                                                "password": process.env.DB_PASSWORD,
                                                                "database": process.env.DB_NAME
                                                            });
// Mix-in for Data Access Methods and SQL Autogenerating Methods
mysqlUtilities.upgrade(connection);
// Mix-in for Introspection Methods
mysqlUtilities.introspection(connection);

var selectHero = function(table, num, callback){
    var query = 'SELECT * FROM p4m.d2_hero';
    if(num){
        query += (' LIMIT ' + num);
    }
    connection.query(query, function(error, result){
        if(error) {
            log.error(error);
        }
        callback.call(this, result[num - 1].name);
    })
};
var dbUser = {
    /**
     * get account_Id
     * @author A.Solovey
     * @param steam_id
     * @param callback
     */
    account_Id : function(steam_id, callback){
        connection.select('d2_users', 'account_id', { steam_id: steam_id }, function(error, results){
            if(error) {
                log.error(error);
            }
            if(results && results[0]) callback.call(this, results[0]);
            else throw "No user with steam_id = " + steam_id;
        });
    },
    /**
     * is User have admin rights
     * @author A.Solovey
     * @param account_id
     * @param callback
     */
    isAdmin : function(account_id, callback){
        connection.select('d2_admins', '*', { account_id: account_id }, function(error, results){
            if(error) {
                log.error(error);
            }
            callback.call(this, results.length > 0);
        });
    },
    /**
     * select full info about user
     * @author A.Solovey
     * @param userId
     * @param callback
     */
    selectUser : function(userId, callback){
        connection.select('d2_users', '*', { account_id: userId }, function(error, results){
            if(error) {
                log.error(error);
            }
            callback.call(this, results[0]);
        });
    },
    upsertUser : function(user, callback){
        //var accId = user.id - 76561197960265728;
        connection.upsert('d2_users', {
                steam_id : user.id,
                steam_name : user.displayName,
                last_loginOn : new Date(),
                logo : user.photos && user.photos[0] && user.photos[0].value || ""
            },
            function(error, results){
            if(error) {
                log.error(error);
            }
            callback.call(this, results);
        });
    },
    addToTournament : function(id, tournamentId, callback){
        var registerOn = new Date();
        this.account_Id(id, function(user){
            connection.upsert('d2_users_daily', {
                account_id : user.account_id,
                registerOn : registerOn,
                tournament_id : tournamentId
            },
            function(error, code){
                if(error) {
                    log.error(error);
                }
                var results = {
                    registerOn: registerOn,
                    tournament_id: tournamentId,
                    code: code
                };
                callback.call(this, results);
            });
        })

    },
    getUserTournaments : function(userId, callback){
        var sql    = 'SELECT * FROM p4m.d2_users_daily where `steam_id` = ' + userId;
        connection.query(sql, function(error, results){
            if(error) {
                log.error(error);
            }
            callback.call(this, results);
        });
    }
};
var getTournaments = function(callback){
    var sql    = 'SELECT name, description, tbl1.id as tournament_id, uCount FROM p4m.d2_tournaments AS tbl1 left join (select tournament_id as tournament_id, count(account_id) as uCount from d2_users_daily group by tournament_id) AS tbl2 on tbl2.tournament_id = tbl1.id where tbl1.active = 1';
    connection.query(sql, function(error, results) {
        if(error) {
            log.error(error);
        }
        callback.call(this, results);
    });
    /*connection.select('d2_tournaments', '*', { active: 1 }, function(error, results){
        if(error) { log.error(error); }
        callback.call(this, results);
    });*/
};
var getCurrentTournament = function(id, callback){
    connection.select('p4m.d2_tournaments', '*', { id : id }, function(error, results){
        if(error) {
            log.error(error);
        }
        callback.call(this, results[0]);
    });
};
var getUsersCount = function(tournament_id, callback){
    var sql    = 'select count(account_id) from d2_users_daily where tournament_id = ' + connection.escape(tournament_id);
    var count = 1;
    connection.query(sql, function(error, count) {
        if(error) {
            log.error(error);
        }
        callback.call(this, count);
    });
    //'select count(account_id) as uCount from d2_users_daily where tournament_id = ' + tournamentId

};
var getTournamentStats = function(condition, callback){
    connection.query(condition, function(error, results){
        if(error) {
            log.error(error);
        }
        callback.call(this, results);
    });
};
var addTournament = function(req){
    connection.query("INSERT INTO `d2_tournaments` (`name`, `description`, `condition`) VALUES ?", [[req.data]],
        function(error){
            if(error) {
                log.error(error);
            }
        });
};



module.exports.selectHero = selectHero;
module.exports.dbUser = dbUser;
module.exports.tournaments = getTournaments;
module.exports.tournamentStats = getTournamentStats;
module.exports.currentTournament = getCurrentTournament;
module.exports.getUsersCount = getUsersCount;
module.exports.addTournament = addTournament;