const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'janvi',         
  password: 'Janvi@0204', 
  database: 'restaurantdb'
});

module.exports = pool.promise();
