const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const users = []; // In-memory user store (for demonstration purposes)

// Register new user
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    // Check if email or username already exists
    if (users.find(u => u.email === email || u.username === username)) {
        return res.json({ success: false, message: 'Email or username already registered' });
    }

    // Validate password length
    if (password.length < 6) {
        return res.json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    // Hash password and store user
    const hashedPassword = bcrypt.hashSync(password, 8);
    users.push({ username, email, password: hashedPassword });
    res.json({ success: true });
});

// Login user
app.post('/login', (req, res) => {
    const { identifier, password } = req.body;
    const user = users.find(u => u.email === identifier || u.username === identifier);

    // Check if user exists and password is correct
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.json({ success: false, message: 'Invalid email/username or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ email: user.email, username: user.username }, 'secret', { expiresIn: '1h' });
    res.json({ success: true, user: { email: user.email, username: user.username }, token });
});

// Check if email or username is already registered
app.post('/check-identifier', (req, res) => {
    const { identifier } = req.body;
    const userExists = users.some(u => u.email === identifier || u.username === identifier);
    res.json({ exists: userExists });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
