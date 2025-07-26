const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '*Q1w2e3r4t5*',
    database: 'node-app',
});

module.exports = connection.promise();
