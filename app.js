const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Leave empty if no password for MySQL
    database: 'nodeinsert'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

// Add product (POST)
app.post('/add-product', (req, res) => {
    const { product_name, description, quantity, price } = req.body;
    let sql = 'INSERT INTO products (product_name, description, quantity, price) VALUES (?, ?, ?, ?)';
    db.query(sql, [product_name, description, quantity, price], (err, result) => {
        if (err) throw err;
        res.redirect('/products.html'); // Redirect to product list after adding
    });
});

// Display products (GET)
app.get('/products', (req, res) => {
    let sql = 'SELECT * FROM products';
    db.query(sql, (err, results) => {
        if (err) throw err;
        let productHTML = '<h1>Product List</h1><ul>';
        results.forEach(product => {
            productHTML += `<li>
                                <strong>Name:</strong> ${product.product_name}<br>
                                <strong>Description:</strong> ${product.description}<br>
                                <strong>Quantity:</strong> ${product.quantity}<br>
                                <strong>Price:</strong> $${product.price}
                            </li><br>`;
        });
        productHTML += '</ul><a href="/">Add another product</a>';
        res.send(productHTML);
    });
});

// Start server
app.listen(3000, () => {
    console.log('Server started on port http://localhost:3000');
});
