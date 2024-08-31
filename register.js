document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registration-form');
    const errorMessage = document.getElementById('error-message');

    registrationForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (username && email && password) {
            const users = JSON.parse(localStorage.getItem('users') || '[]');

            // Check if the username or email already exists
            const userExists = users.some(user => user.username === username || user.email === email);
            if (userExists) {
                errorMessage.textContent = 'Username or email already exists.';
            } else {
                // Store new user data
                users.push({ username, email, password });
                localStorage.setItem('users', JSON.stringify(users));

                // Redirect to login page
                window.location.href = 'login.html';
            }
        } else {
            errorMessage.textContent = 'All fields are required.';
        }
    });
});

