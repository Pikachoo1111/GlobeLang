document.getElementById('logout-button').addEventListener('click', () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = 'login.html'; // Redirect to login page after logout
});
