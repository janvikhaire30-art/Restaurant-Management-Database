const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'janvi',          // your MySQL username
  password: 'Janvi@0204', // your MySQL password
  database: 'restaurantdb'
});

module.exports = pool.promise();