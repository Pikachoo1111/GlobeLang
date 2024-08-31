document.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'login.html'; // Redirect to login if not logged in
        return;
    }

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
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html'; // Redirect to login page after logout
    });

    function loadChatContent(tabId) {
        chatContainer.innerHTML = `<p>Loading content for ${tabId}...</p>`;
    }
});

