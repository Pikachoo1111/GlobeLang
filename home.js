document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('#sidebar ul li a');
    const chatContainer = document.getElementById('chat-container');

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = e.target.id;

            // Load chat content based on the clicked tab
            loadChatContent(tabId);
        });
    });

    document.getElementById('logout-button').addEventListener('click', () => {
        localStorage.removeItem('user');
        window.location.href = 'login.html'; // Redirect to login page after logout
    });

    function loadChatContent(tabId) {
        // Example content loading based on tab ID
        // Replace this with actual chat content fetching logic
        chatContainer.innerHTML = `<p>Loading content for ${tabId}...</p>`;
    }
});

