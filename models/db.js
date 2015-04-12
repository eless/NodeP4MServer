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
    connection.query(query, function(error, result, fields){
        if(error) throw error;
        callback.call(this, result[num - 1].name);
    })
};
var dbUser = function(){
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
        connection.upsert('d2_users', {
                steam_id : user.id,
                steam_name : user.displayName,
                account_id : user.id - 76561197960265728,
                logo : user.photos && user.photos[0] && user.photos[0].value || ""
            },
            function(error, results){
            if(error) throw error;
            callback.call(this, results);
        });
    };
};


module.exports.selectHero = selectHero;
module.exports.dbUser = dbUser;