//configurações de ligação á BD
var mysql = require('mysql');
var options = require('../options.json');

var dbConnection = mysql.createConnection({
    host: options.database.host,
    user: options.database.user,
    password: options.database.password,
    database: options.database.database
});

dbConnection.connect(function (err) {
    console.log("a conectar á DB");
    if (err) throw err;
});

exports.dbConnection = dbConnection;
