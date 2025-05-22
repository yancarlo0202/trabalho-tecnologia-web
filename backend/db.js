const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'adm',
    password: '1234',
    database: 'Locadora'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('conectado ao banco de dados MYSQL!')
});

module.exports = connection;