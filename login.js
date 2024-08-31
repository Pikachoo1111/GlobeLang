document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const identifier = document.getElementById('identifier').value;
    const password = document.getElementById('password').value;

    // Handle login
    const loginResponse = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
    });

    const result = await loginResponse.json();

    if (result.success) {
        localStorage.setItem('user', JSON.stringify(result.user)); // Save user info
        localStorage.setItem('token', result.token); // Save JWT token
        window.location.href = 'home.html'; // Redirect to the home page after login
    } else {
        document.getElementById('error-message').textContent = result.message; // Show error message
    }
});
