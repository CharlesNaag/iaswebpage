const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const session = require('express-session');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public', 'css')));

// Session configuration
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Note: For production, use 'secure: true' with HTTPS
}));

// Database connection
const pool = new Pool({
    host: process.env.PG_HOST || 'dpg-cq6uvq6ehbks73979070-a',
    user: process.env.PG_USER || 'iaswebactivity_user',
    password: process.env.PG_PASSWORD || 'c1o0pK4As2yP6yWHZIf0ma1n0mUjU8Rs',
    database: process.env.PG_DATABASE || 'iaswebactivity',
    port: process.env.PG_PORT || 5432
});

pool.connect((err) => {
    if (err) {
        console.error('Connection error', err.stack);
    } else {
        console.log('Connected to database');
    }
});

// Route for serving home.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for about.html
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

// Route for contact.html
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});
app.get('/landing', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'landing.html'));
});

app.get('/login_signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login_signup.html'));
});

// Routes for APIs
const loginRoute = require('./backend/login');
const registerRoute = require('./backend/register');
const forgotPasswordRoute = require('./backend/forgot_password');

app.use('/api', loginRoute);
app.use('/api', registerRoute);
app.use('/api', forgotPasswordRoute);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = pool;
