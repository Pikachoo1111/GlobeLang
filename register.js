document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        document.getElementById('error-message').textContent = 'Passwords do not match';
        return;
    }

    // Check if email or username is already registered
    const identifierCheckResponse = await fetch('/check-identifier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email })
    });

    const identifierCheckResult = await identifierCheckResponse.json();

    if (identifierCheckResult.exists) {
        document.getElementById('error-message').textContent = 'Email or username already registered. Please log in.';
        return;
    }

    // Handle registration
    const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    });

    const result = await response.json();

    if (result.success) {
        // Redirect to login page after successful registration
        window.location.href = 'login.html';
    } else {
        document.getElementById('error-message').textContent = result.message;
    }
});

