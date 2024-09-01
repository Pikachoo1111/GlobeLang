document.addEventListener('DOMContentLoaded', () => {
    const roomNameElement = document.getElementById('room-name');
    const messageInput = document.getElementById('message-input');
    const sendMessageButton = document.getElementById('send-message');
    const inviteInput = document.getElementById('invite-input');
    const inviteButton = document.getElementById('invite-button');
    const messagesContainer = document.getElementById('messages');
    const backButton = document.getElementById('back-button');
    const languageSelect = document.getElementById('language-select');

    // Populate the language select dropdown with all available languages
    const languages = [
        { code: 'ar', name: 'Arabic' },
        { code: 'cs', name: 'Czech' },
        { code: 'da', name: 'Danish' },
        { code: 'de', name: 'German' },
        { code: 'el', name: 'Greek' },
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' },
        { code: 'et', name: 'Estonian' },
        { code: 'fi', name: 'Finnish' },
        { code: 'fr', name: 'French' },
        { code: 'he', name: 'Hebrew' },
        { code: 'hi', name: 'Hindi' },
        { code: 'hr', name: 'Croatian' },
        { code: 'hu', name: 'Hungarian' },
        { code: 'id', name: 'Indonesian' },
        { code: 'it', name: 'Italian' },
        { code: 'ja', name: 'Japanese' },
        { code: 'ka', name: 'Georgian' },
        { code: 'km', name: 'Khmer' },
        { code: 'ko', name: 'Korean' },
        { code: 'la', name: 'Latin' },
        { code: 'lv', name: 'Latvian' },
        { code: 'lt', name: 'Lithuanian' },
        { code: 'mk', name: 'Macedonian' },
        { code: 'ml', name: 'Malayalam' },
        { code: 'mn', name: 'Mongolian' },
        { code: 'mr', name: 'Marathi' },
        { code: 'ms', name: 'Malay' },
        { code: 'mt', name: 'Maltese' },
        { code: 'nl', name: 'Dutch' },
        { code: 'no', name: 'Norwegian' },
        { code: 'pl', name: 'Polish' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'ro', name: 'Romanian' },
        { code: 'ru', name: 'Russian' },
        { code: 'si', name: 'Sinhala' },
        { code: 'sk', name: 'Slovak' },
        { code: 'sl', name: 'Slovenian' },
        { code: 'sq', name: 'Albanian' },
        { code: 'sr', name: 'Serbian' },
        { code: 'su', name: 'Sundanese' },
        { code: 'sv', name: 'Swedish' },
        { code: 'sw', name: 'Swahili' },
        { code: 'ta', name: 'Tamil' },
        { code: 'te', name: 'Telugu' },
        { code: 'th', name: 'Thai' },
        { code: 'tr', name: 'Turkish' },
        { code: 'uk', name: 'Ukrainian' },
        { code: 'ur', name: 'Urdu' },
        { code: 'vi', name: 'Vietnamese' },
        { code: 'cy', name: 'Welsh' },
        { code: 'xh', name: 'Xhosa' },
        { code: 'yi', name: 'Yiddish' },
        { code: 'zu', name: 'Zulu' }
    ];

    languages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang.code;
        option.textContent = lang.name;
        languageSelect.appendChild(option);
    });

    function displayMessages() {
        messagesContainer.innerHTML = '';
        messages.forEach(msg => {
            const messageElement = document.createElement('div');
            messageElement.innerHTML = `
                <strong>${msg.user}:</strong>
                <div>Original: ${msg.originalText}</div>
                <div>Literal Translation: ${msg.literalTranslation}</div>
                <div>Translation: ${msg.translatedText}</div>
            `;
            messagesContainer.appendChild(messageElement);
        });
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async function translateText(text, targetLang = 'en') {
        try {
            const response = await fetch('https://libretranslate.de/translate', {
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
            return data.translatedText || "Translation failed.";
        } catch (error) {
            console.error('Error translating text:', error);
            return "Error translating message. Please try again later.";
        }
    }

    async function handleMessageTranslation(messageText, targetLang = 'en') {
        const translatedMessage = await translateText(messageText, targetLang);
        const literalTranslation = `Literal translation - ${messageText}`;
        return {
            translatedText: translatedMessage,
            literalTranslation: literalTranslation
        };
    }

    sendMessageButton.addEventListener('click', async () => {
        const messageText = messageInput.value.trim();
        const targetLang = languageSelect.value; // Get the selected target language
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (messageText && currentUser.username) {
            const { translatedText, literalTranslation } = await handleMessageTranslation(messageText, targetLang);
            const newMessage = {
                user: currentUser.username,
                originalText: messageText,
                literalTranslation: literalTranslation,
                translatedText: translatedText
            };
            let messages = JSON.parse(localStorage.getItem(`messages_${roomId}`) || '[]');
            messages.push(newMessage);
            localStorage.setItem(`messages_${roomId}`, JSON.stringify(messages));
            displayMessages();
            messageInput.value = '';
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
        // Implement functionality to go back to the previous page or room list
    });

    // Load initial messages
    let messages = JSON.parse(localStorage.getItem(`messages_${roomId}`) || '[]');
    displayMessages();
});
