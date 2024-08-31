document.addEventListener('DOMContentLoaded', () => {
    const roomNameElement = document.getElementById('room-name');
    const messageInput = document.getElementById('message-input');
    const sendMessageButton = document.getElementById('send-message');
    const messagesContainer = document.getElementById('messages');
    const backButton = document.getElementById('back-button');

    // Get room ID from query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('room');

    // Example chat rooms (could be loaded from a server or database in a real app)
    const chatRooms = [
        { id: 'room1', name: 'General Chat' },
        { id: 'room2', name: 'Tech Talk' },
        { id: 'room3', name: 'Random' }
    ];

    const room = chatRooms.find(room => room.id === roomId);
    if (room) {
        roomNameElement.textContent = room.name;
    } else {
        roomNameElement.textContent = 'Unknown Room';
    }

    // Handle sending messages
    sendMessageButton.addEventListener('click', () => {
        const message = messageInput.value;
        if (message) {
            const messageElement = document.createElement('div');
            messageElement.textContent = `You: ${message}`;
            messagesContainer.appendChild(messageElement);
            messageInput.value = '';
        }
    });

    // Handle back button
    backButton.addEventListener('click', () => {
        window.location.href = 'home.html';
    });
});
