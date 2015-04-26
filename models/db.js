/**
 * Created by Eless on 30.03.2015.
 */
var mysql = require('mysql');
var config = require('../config/index');
var mysqlUtilities = require('mysql-utilities');

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
        if(error) throw error;
        callback.call(this, result[num - 1].name);
    })
};
var dbUser = function(){
    this.account_Id = function(steam_id, callback){
        connection.select('d2_users', 'account_id', { steam_id: steam_id }, function(error, results){
            if(error) throw error;
            callback.call(this, results[0]);
        });
    };
    this.selectUser = function(userId, callback){
        connection.select('d2_users', '*', { steam_id: userId }, function(error, results){
            if(error) throw error;
            callback.call(this, results[0]);
        });
    };
    this.addNewUser = function(user, callback){
        connection.upsert('d2_users', {
            steam_id : user.id,
            steam_name : user.displayName
            },
            function(error, results){
            if(error) throw error;
            callback.call(this, results);
        });
    };
    this.upsertUser = function(user, callback){
        //var accId = user.id - 76561197960265728;
        connection.upsert('d2_users', {
                steam_id : user.id,
                steam_name : user.displayName,
                last_loginOn : new Date(),
                logo : user.photos && user.photos[0] && user.photos[0].value || ""
            },
            function(error, results){
            if(error) throw error;
            callback.call(this, results);
        });
    };
    this.addToTournament = function(id, tournamentId, callback){
        var registerOn = new Date();
        this.account_Id(id, function(user){
            connection.upsert('d2_users_daily', {
                account_id : user.account_id,
                registerOn : registerOn,
                tournament_id : tournamentId
            },
            function(error, code){
                if(error) throw error;
                var results = {
                    registerOn: registerOn,
                    tournament_id: tournamentId,
                    code: code
                };
                callback.call(this, results);
            });
        })

    };
    this.getUserTournaments = function(userId, callback){
        connection.select('d2_users_daily', '*', { steam_id : userId }, function(error, results){
            if(error) throw error;
            callback.call(this, results);
        });
    }
};
var getTournaments = function(callback){
    var sql    = 'SELECT * FROM p4m.d2_tournaments AS tbl1 left join (select tournament_id, count(account_id) as uCount from d2_users_daily group by tournament_id) AS tbl2 on tbl2.tournament_id = tbl1.id where tbl1.active = 1';
    connection.query(sql, function(err, results) {
        if(err) throw err;
        callback.call(this, results);
    });
    /*connection.select('d2_tournaments', '*', { active: 1 }, function(error, results){
        if(error) throw error;
        callback.call(this, results);
    });*/
};
var getTournamentStats = function(tournamentId, callback){
    connection.select('d2_stats_daily', '*', { active: 1 }, function(error, results){
        if(error) throw error;
        callback.call(this, results);
    });
};



module.exports.selectHero = selectHero;
module.exports.dbUser = dbUser;
module.exports.tournaments = getTournaments;
module.exports.tournamentStats = getTournamentStats;