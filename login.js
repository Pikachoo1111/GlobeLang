document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (result.success) {
        // localStorage.setItem('user', JSON.stringify(result.user));
        window.location.href = 'index.html'; // Redirect to the chat app
    } else {
        // document.getElementById('error-message').textContent = result.message;
        // if (result.message === 'Account not found') {
        //     document.getElementById('register-prompt').textContent = 'Click the link above to create an account.';
        // }
        // localStorage.setItem('user', JSON.stringify(result.user));
        window.location.href = 'index.html'; // Redirect to the chat app    
    
    }
});
