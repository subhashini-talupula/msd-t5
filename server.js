const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// --------------------
// Sample Data
// --------------------
let products = [
    { id: 1, name: 'Wireless Mouse', price: 999, stock: 50 },
    { id: 2, name: 'Keyboard', price: 1999, stock: 30 }
];

let orders = [];
let orderIdCounter = 1;

// --------------------
// PRODUCTS ENDPOINTS
// --------------------
app.get('/api/products', (req, res) => {
    res.json(products);
});

app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (product) res.json(product);
    else res.status(404).json({ error: 'Product not found' });
});

app.post('/api/products', (req, res) => {
    const data = req.body;
    const newProduct = {
        id: products.length + 1,
        name: data.name,
        price: data.price,
        stock: data.stock
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// --------------------
// ORDERS ENDPOINTS
// --------------------
app.get('/api/orders', (req, res) => {
    res.json(orders);
});

app.get('/api/orders/:id', (req, res) => {
    const order = orders.find(o => o.id === parseInt(req.params.id));
    if (order) res.json(order);
    else res.status(404).json({ error: 'Order not found' });
});

app.post('/api/orders', (req, res) => {
    const data = req.body;
    const totalAmount = data.items.reduce((total, item) => {
        const product = products.find(p => p.id === item.productId);
        return total + (product.price * item.quantity);
    }, 0);

    const newOrder = {
        id: orderIdCounter++,
        customerId: data.customerId,
        items: data.items,
        totalAmount,
        status: 'Pending'
    };
    orders.push(newOrder);
    res.status(201).json(newOrder);
});

// --------------------
// ORDER STATUS ENDPOINTS
// --------------------
app.get('/api/orders/:id/status', (req, res) => {
    const order = orders.find(o => o.id === parseInt(req.params.id));
    if (order) res.json({ orderId: order.id, status: order.status });
    else res.status(404).json({ error: 'Order not found' });
});

app.patch('/api/orders/:id/status', (req, res) => {
    const order = orders.find(o => o.id === parseInt(req.params.id));
    if (order) {
        order.status = req.body.status || order.status;
        res.json(order);
    } else {
        res.status(404).json({ error: 'Order not found' });
    }
});

// --------------------
// RUN SERVER
// --------------------
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
