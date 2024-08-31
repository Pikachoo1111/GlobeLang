const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const usersFilePath = path.join(__dirname, 'users.json');

// Helper function to read users from file
const readUsersFromFile = () => {
    if (!fs.existsSync(usersFilePath)) {
        return {};
    }
    const data = fs.readFileSync(usersFilePath);
    return JSON.parse(data);
};

// Helper function to write users to file
const writeUsersToFile = (users) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

// Register new user
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    const users = readUsersFromFile();

    if (users[username] || Object.values(users).includes(password)) {
        return res.json({ success: false, message: 'Username or email already registered' });
    }

    if (password.length < 6) {
        return res.json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    users[username] = password;
    writeUsersToFile(users);
    res.json({ success: true });
});

// Login user
app.post('/login', (req, res) => {
    const { identifier, password } = req.body;
    const users = readUsersFromFile();

    if (users[identifier] === password) {
        res.json({ success: true, message: 'Login successful' });
    } else {
        // Check if identifier (username or email) exists
        const exists = Object.keys(users).includes(identifier);
        res.json({ success: false, message: exists ? 'Invalid password' : 'Account does not exist' });
    }
});

// Check if email or username is already registered
app.post('/check-identifier', (req, res) => {
    const { identifier } = req.body;
    const users = readUsersFromFile();
    const exists = Object.keys(users).includes(identifier);
    res.json({ exists });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
