document.getElementById('logout-button').addEventListener('click', () => {
    localStorage.removeItem('user');
    window.location.href = 'login.html'; // Redirect to login page after logout
});
