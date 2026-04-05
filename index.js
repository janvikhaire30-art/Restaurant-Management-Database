const express = require('express');
const db = require('./db');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ------------------ READ ------------------
app.get('/menu', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM menu');
  res.json(rows);
});

app.get('/customers', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM customers');
  res.json(rows);
});

app.get('/orders', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM orders');
  res.json(rows);
});

app.get('/order-details', async (req, res) => {
  const [rows] = await db.query(`
    SELECT o.OrderID, c.Name AS CustomerName, m.ItemName, oi.Quantity, o.OrderDate
    FROM order_items oi
    JOIN orders o ON oi.OrderID = o.OrderID
    JOIN customers c ON o.CustomerID = c.CustomerID
    JOIN menu m ON oi.ItemID = m.ItemID
  `);
  res.json(rows);
});

// ------------------ CREATE ------------------
app.post('/add-menu', async (req, res) => {
  const { ItemName, Price } = req.body;
  await db.query('INSERT INTO menu (ItemName, Price) VALUES (?, ?)', [ItemName, Price]);
  res.send('Menu item added');
});

app.post('/add-customer', async (req, res) => {
  const { Name, Phone, Email } = req.body;
  await db.query('INSERT INTO customers (Name, Phone, Email) VALUES (?, ?, ?)', [Name, Phone, Email]);
  res.send('Customer added');
});

app.post('/place-order', async (req, res) => {
  const { CustomerID, ItemID, Quantity } = req.body;
  const [orderResult] = await db.query('INSERT INTO orders (CustomerID, OrderDate) VALUES (?, NOW())', [CustomerID]);
  const orderID = orderResult.insertId;
  await db.query('INSERT INTO order_items (OrderID, ItemID, Quantity) VALUES (?, ?, ?)', [orderID, ItemID, Quantity]);
  res.send('Order placed');
});

// ------------------ UPDATE ------------------
app.put('/update-customer/:id', async (req, res) => {
  const { Name, Phone, Email } = req.body;
  await db.query('UPDATE customers SET Name=?, Phone=?, Email=? WHERE CustomerID=?',
    [Name, Phone, Email, req.params.id]);
  res.send(`Customer ${req.params.id} updated`);
});

app.put('/update-menu/:id', async (req, res) => {
  const { ItemName, Price } = req.body;
  await db.query('UPDATE menu SET ItemName=?, Price=? WHERE ItemID=?',
    [ItemName, Price, req.params.id]);
  res.send(`Menu item ${req.params.id} updated`);
});

app.put('/update-order/:id', async (req, res) => {
  const { ItemID, Quantity } = req.body;
  await db.query('UPDATE order_items SET Quantity=? WHERE OrderID=? AND ItemID=?',
    [Quantity, req.params.id, ItemID]);
  res.send(`Order ${req.params.id} updated`);
});

// ------------------ DELETE ------------------
app.delete('/delete-customer/:id', async (req, res) => {
  await db.query('DELETE FROM customers WHERE CustomerID=?', [req.params.id]);
  res.send(`Customer ${req.params.id} deleted`);
});

app.delete('/delete-order/:id', async (req, res) => {
  await db.query('DELETE FROM order_items WHERE OrderID=?', [req.params.id]);
  await db.query('DELETE FROM orders WHERE OrderID=?', [req.params.id]);
  res.send(`Order ${req.params.id} deleted`);
});

app.delete('/delete-menu/:id', async (req, res) => {
  await db.query('DELETE FROM menu WHERE ItemID=?', [req.params.id]);
  res.send(`Menu item ${req.params.id} deleted`);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
