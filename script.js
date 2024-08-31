document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html'; // Redirect to login if not authenticated
        return;
    }

    document.getElementById('app').style.display = 'flex';
    const currentChannel = 'general'; // Default channel

    document.getElementById('send-button').addEventListener('click', sendMessage);
    document.getElementById('channel-list').addEventListener('click', changeChannel);
    document.getElementById('logout-button').addEventListener('click', logout);

    loadMessages(currentChannel);

    function sendMessage() {
        const messageInput = document.getElementById('message-input');
        const message = messageInput.value;
        if (message.trim() === '') return;

        fetch('/send-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ channel: currentChannel, message, userId: user.id })
        });

        messageInput.value = '';
    }

    function loadMessages(channel) {
        fetch(`/messages?channel=${channel}`)
            .then(response => response.json())
            .then(messages => {
                const messageContainer = document.getElementById('message-container');
                messageContainer.innerHTML = '';
                messages.forEach(msg => {
                    const messageElement = document.createElement('div');
                    messageElement.textContent = msg.text;
                    messageContainer.appendChild(messageElement);
                });
            });
    }

    function changeChannel(event) {
        if (event.target.classList.contains('channel')) {
            const newChannel = event.target.dataset.channel;
            loadMessages(newChannel);
            document.querySelectorAll('.channel').forEach(channel => channel.classList.remove('active'));
            event.target.classList.add('active');
        }
    }

    function logout() {
        localStorage.removeItem('user');
        window.location.href = 'login.html'; // Redirect to login on logout
    }
});
