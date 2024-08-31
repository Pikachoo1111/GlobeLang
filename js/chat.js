document.addEventListener('DOMContentLoaded', () => {
    const roomNameElement = document.getElementById('room-name');
    const messageInput = document.getElementById('message-input');
    const sendMessageButton = document.getElementById('send-message');
    const inviteInput = document.getElementById('invite-input');
    const inviteButton = document.getElementById('invite-button');
    const messagesContainer = document.getElementById('messages');
    const backButton = document.getElementById('back-button');

    // Get room ID from query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('room');

    if (!roomId) {
        console.error('Room ID not found in URL');
        return;
    }

    // Load chat rooms and messages from local storage
    let chatRooms = JSON.parse(localStorage.getItem('chatRooms') || '[]');
    let room = chatRooms.find(room => room.id === roomId);

    if (room) {
        roomNameElement.textContent = room.name;
    } else {
        roomNameElement.textContent = 'Unknown Room';
    }

    let messages = JSON.parse(localStorage.getItem(`messages_${roomId}`) || '[]');

    // Function to display messages
    function displayMessages() {
        messagesContainer.innerHTML = '';
        messages.forEach(msg => {
            const messageElement = document.createElement('div');
            messageElement.textContent = `${msg.user}: ${msg.text}`;
            messagesContainer.appendChild(messageElement);
        });
        messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to bottom
    }

    displayMessages();

    // Handle sending messages
    sendMessageButton.addEventListener('click', () => {
        const messageText = messageInput.value.trim();
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (messageText && currentUser.username) {
            const newMessage = {
                user: currentUser.username,
                text: messageText
            };
            messages.push(newMessage);
            localStorage.setItem(`messages_${roomId}`, JSON.stringify(messages));
            displayMessages();
            messageInput.value = ''; // Clear input field
        }
    });

    // Handle inviting users
    inviteButton.addEventListener('click', () => {
        const inviteTarget = inviteInput.value.trim();
        if (inviteTarget) {
            console.log(`Inviting ${inviteTarget} to room ${roomId}`);

            // Simulate sending an invitation (for demo purposes)
            const inviteMessageElement = document.createElement('div');
            inviteMessageElement.textContent = `Invitation sent to ${inviteTarget}`;
            messagesContainer.appendChild(inviteMessageElement);

            inviteInput.value = '';
        }
    });

    // Handle back button
    backButton.addEventListener('click', () => {
        window.location.href = 'home.html';
    });

    // Refresh messages periodically
    setInterval(() => {
        displayMessages();
    }, 1000); // Refresh every second to keep up with new messages
});
