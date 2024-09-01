document.addEventListener('DOMContentLoaded', () => {
    const roomNameElement = document.getElementById('room-name');
    const messageInput = document.getElementById('message-input');
    const sendMessageButton = document.getElementById('send-message');
    const inviteInput = document.getElementById('invite-input');
    const inviteButton = document.getElementById('invite-button');
    const messagesContainer = document.getElementById('messages');
    const backButton = document.getElementById('back-button');

    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('room');

    if (!roomId) {
        console.error('Room ID not found in URL');
        return;
    }

    let chatRooms = JSON.parse(localStorage.getItem('chatRooms') || '[]');
    let room = chatRooms.find(room => room.id === roomId);

    if (room) {
        roomNameElement.textContent = room.name;
    } else {
        roomNameElement.textContent = 'Unknown Room';
    }

    let messages = JSON.parse(localStorage.getItem(`messages_${roomId}`) || '[]');

    function displayMessages() {
        messagesContainer.innerHTML = '';
        messages.forEach(msg => {
            const messageElement = document.createElement('div');
            messageElement.innerHTML = `
                <strong>${msg.user}:</strong>
                <div>Original: ${msg.originalText}</div>
                <div>Translation: ${msg.translatedText}</div>
            `;
            messagesContainer.appendChild(messageElement);
        });
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async function translateText(text, retries = 3) {
        const endpoint = 'https://libretranslate.de/translate'; // Ensure this is the correct endpoint

        for (let attempt = 0; attempt < retries; attempt++) {
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        q: text,
                        source: 'auto',  // Automatically detect the source language
                        target: 'en'     // Translate to English
                    })
                });

                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }

                const data = await response.json();

                // Check if the translation result is valid
                if (data && data.translatedText) {
                    return data.translatedText;
                } else {
                    throw new Error('Invalid translation response');
                }
            } catch (error) {
                console.error(`Attempt ${attempt + 1} failed: ${error.message}`);
                // If it's the last attempt, return a fallback message
                if (attempt === retries - 1) {
                    return "Translation not available. Please try again later.";
                }
            }
        }
    }

    sendMessageButton.addEventListener('click', async () => {
        const messageText = messageInput.value.trim();
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (messageText && currentUser.username) {
            const translatedText = await translateText(messageText);
            const newMessage = {
                user: currentUser.username,
                originalText: messageText,
                translatedText: translatedText
            };
            messages.push(newMessage);
            localStorage.setItem(`messages_${roomId}`, JSON.stringify(messages));
            displayMessages();
            messageInput.value = ''; // Clear input field after sending message
        } else {
            console.error('Message text or user information is missing.');
        }
    });

    inviteButton.addEventListener('click', () => {
        const inviteUsername = inviteInput.value.trim();
        if (inviteUsername) {
            let users = JSON.parse(localStorage.getItem('users') || '[]');
            if (users.some(user => user.username === inviteUsername || user.email === inviteUsername)) {
                if (!room.users.includes(inviteUsername)) {
                    room.users.push(inviteUsername);
                    localStorage.setItem('chatRooms', JSON.stringify(chatRooms));
                    inviteInput.value = '';
                    alert(`User ${inviteUsername} has been invited to the room.`);
                } else {
                    alert(`User ${inviteUsername} is already in the room.`);
                }
            } else {
                alert(`User ${inviteUsername} does not exist.`);
            }
        }
    });

    backButton.addEventListener('click', () => {
        window.location.href = '../home/home.html';
    });

    // Load initial messages
    displayMessages();
});
