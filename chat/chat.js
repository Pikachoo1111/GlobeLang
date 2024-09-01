document.addEventListener('DOMContentLoaded', () => {
    const roomNameElement = document.getElementById('room-name');
    const messageInput = document.getElementById('message-input');
    const sendMessageButton = document.getElementById('send-message');
    const messagesContainer = document.getElementById('messages');
    const languageSelect = document.getElementById('language-select');  // Dropdown for language selection

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
        let messages = JSON.parse(localStorage.getItem(`messages_${roomId}`) || '[]');
        messagesContainer.innerHTML = '';
        messages.forEach(msg => {
            const messageElement = document.createElement('div');
            messageElement.textContent = `${msg.user}: ${msg.text}`;
            messagesContainer.appendChild(messageElement);
        });
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    displayMessages();

    sendMessageButton.addEventListener('click', async () => {
        const messageText = messageInput.value.trim();
        const targetLang = languageSelect.value;  // Get selected language
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (messageText && currentUser.username) {
            const newMessage = {
                user: currentUser.username,
                text: messageText
            };
            messages.push(newMessage);
            localStorage.setItem(`messages_${roomId}`, JSON.stringify(messages));
            displayMessages();
            messageInput.value = '';

            // Send message to the translation server
            const translation = await translateText(messageText, targetLang);
            if (translation) {
                const translatedMessage = {
                    user: 'Translation',
                    text: `${translation.original_text} (Literal Translation: ${translation.literal_translation}, Contextual Translation: ${translation.contextual_translation})`
                };
                messages.push(translatedMessage);
                localStorage.setItem(`messages_${roomId}`, JSON.stringify(messages));
                displayMessages();
            }
        }
    });

    setInterval(() => {displayMessages();}, 5);
});

