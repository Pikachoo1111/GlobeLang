document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const identifier = document.getElementById('identifier').value;
        const password = document.getElementById('password').value;

        if (validateUser(identifier, password)) {
            // Store user info in localStorage
            localStorage.setItem('currentUser', identifier);
            
            // Redirect to home page
            window.location.href = 'home.html';
        } else {
            errorMessage.textContent = 'Invalid username/email or password.';
        }
    });

    function validateUser(identifier, password) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        return users.some(user => 
            (user.username === identifier || user.email === identifier) && user.password === password
        );
    }
});
