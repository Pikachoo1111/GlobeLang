document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registration-form');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        // Retrieve existing users from localStorage
        let users = JSON.parse(localStorage.getItem('users') || '[]');

        // Check if the username or email already exists
        if (users.some(user => user.email === email || user.username === username)) {
            errorMessage.textContent = 'Username or email already exists.';
            return;
        }

        // Add the new user to the list
        users.push({ username, email, password });
        localStorage.setItem('users', JSON.stringify(users));

        // Redirect to login page
        window.location.href = '../login/login.html';
    });
});
