/**
 * Created by Eless on 30.03.2015.
 */
var mysql = require('mysql');
var config = require('../config/index');
var connection = mysql.createConnection(config.get('dbConfig'));

var select = function(table, num, callback){
    connection.connect();
    var query = 'SELECT * FROM p4m.d2_hero';
    if(num){
        query += (' LIMIT ' + num);
    }
    connection.query(query, function(error, result, fields){
        if(error) throw error;
        connection.end();
        callback.call(this, result[num - 1].name);
    })
};
module.exports = select;