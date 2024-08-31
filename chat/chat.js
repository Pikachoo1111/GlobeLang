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
            messageElement.textContent = `${msg.user}: ${msg.text}`;
            messagesContainer.appendChild(messageElement);
        });
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    displayMessages();

    async function sendMessageToChatGPT(message) {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer YOUR_OPENAI_API_KEY`
                },
                body: JSON.stringify({
                    model: "gpt-4", // Or "gpt-3.5-turbo" depending on your preference
                    messages: [{role: "user", content: message}],
                })
            });

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Error sending message to ChatGPT:', error);
        }
    }

    sendMessageButton.addEventListener('click', async () => {
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
            messageInput.value = '';

            // Send message to ChatGPT
            const chatGPTResponse = await sendMessageToChatGPT(messageText);
            if (chatGPTResponse) {
                const gptMessage = {
                    user: 'ChatGPT',
                    text: chatGPTResponse
                };
                messages.push(gptMessage);
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
