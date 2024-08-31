document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const usernameOrEmail = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value.trim();

        // Retrieve existing users from localStorage
        let users = JSON.parse(localStorage.getItem('users') || '[]');

        // Check if the username or email and password match any existing user
        let user = users.find(user => (user.username === usernameOrEmail || user.email === usernameOrEmail) && user.password === password);

        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = '../home/home.html';
        } else {
            errorMessage.textContent = 'Invalid username, email, or password.';
        }
    });
});
