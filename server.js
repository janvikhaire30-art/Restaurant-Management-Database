const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'YOUR_PASSWORD',
    database: 'restaurant_db'
});

db.connect(err => {
    if (err) {
        console.log('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL database!');
    }
});

// Routes
app.post('/add', (req, res) => {
    const { name, price, category } = req.body;
    const sql = 'INSERT INTO menu (name, price, category) VALUES (?, ?, ?)';
    db.query(sql, [name, price, category], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.get('/menu', (req, res) => {
    db.query('SELECT * FROM menu', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
