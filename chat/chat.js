document.addEventListener('DOMContentLoaded', () => {
    const roomNameElement = document.getElementById('room-name');
    const messageInput = document.getElementById('message-input');
    const sendMessageButton = document.getElementById('send-message');
    const inviteInput = document.getElementById('invite-input');
    const inviteButton = document.getElementById('invite-button');
    const messagesContainer = document.getElementById('messages');
    const backButton = document.getElementById('back-button');
    const languageSelect = document.getElementById('language-select');

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
                <div>Translated: ${msg.translatedText}</div>
            `;
            messagesContainer.appendChild(messageElement);
        });
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    displayMessages();

    async function translateText(text, targetLang = 'en') {
        try {
            const response = await fetch('https://libretranslate.de/translate', { // LibreTranslate API endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    q: text,
                    source: 'auto',
                    target: targetLang
                })
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            const data = await response.json();
            return data.translatedText; // LibreTranslate returns translation in the field 'translatedText'
        } catch (error) {
            console.error('Error translating text:', error);
            return text; // Fallback to the original text in case of error
        }
    }

    async function handleMessageTranslation(messageText, targetLang = 'en') {
        // Translate the whole message to the target language
        const translatedMessage = await translateText(messageText, targetLang);

        return translatedMessage;
    }

    sendMessageButton.addEventListener('click', async () => {
        const messageText = messageInput.value.trim();
        const targetLang = languageSelect.value; // Get the selected target language
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (messageText && currentUser.username) {
            // Translate the message
            const translatedMessage = await handleMessageTranslation(messageText, targetLang);
            if (translatedMessage) {
                const newMessage = {
                    user: currentUser.username,
                    originalText: messageText,
                    translatedText: translatedMessage // Show both original and translated messages
                };
                messages.push(newMessage);
                localStorage.setItem(`messages_${roomId}`, JSON.stringify(messages));
                displayMessages();
                messageInput.value = '';
            } else {
                // If translation fails, show a fallback message
                const errorMessage = {
                    user: 'Translator',
                    originalText: messageText,
                    translatedText: "Error translating message. Please check your input or try again later."
                };
                messages.push(errorMessage);
                localStorage.setItem(`messages_${roomId}`, JSON.stringify(messages));
                displayMessages();
            }
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

    setInterval(() => {
        displayMessages();
    }, 1000);
});
