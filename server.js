const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

const users = []; // In-memory user store

app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    if (users.find(u => u.email === email)) {
        return res.json({ success: false, message: 'User already exists' });
    }

    if (password.length < 6) {
        return res.json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);
    users.push({ username, email, password: hashedPassword });
    res.json({ success: true });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.json({ success: false, message: 'Account not found' });
    }
    if (bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ email }, 'secret', { expiresIn: '1h' });
        res.json({ success: true, user: { email, username: user.username }, token });
    } else {
        res.json({ success: false, message: 'Invalid password' });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
