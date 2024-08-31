document.addEventListener('DOMContentLoaded', () => {
    const chatRoomsContainer = document.getElementById('chat-rooms');
    const createRoomButton = document.getElementById('create-room');
    const logoutButton = document.getElementById('logout');

    // Retrieve current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    // Retrieve chat rooms from localStorage
    let chatRooms = JSON.parse(localStorage.getItem('chatRooms') || '[]');

    function updateChatRooms() {
        chatRoomsContainer.innerHTML = '';
        chatRooms.forEach(room => {
            const roomElement = document.createElement('div');
            roomElement.textContent = room.name;
            roomElement.classList.add('room');
            roomElement.addEventListener('click', () => {
                window.location.href = `../chat/chat.html?room=${room.id}`;
            });
            chatRoomsContainer.appendChild(roomElement);
        });
    }

    createRoomButton.addEventListener('click', () => {
        const roomName = prompt('Enter the name of the new room:');
        if (roomName) {
            const newRoom = {
                id: `room_${Date.now()}`,
                name: roomName,
                users: [currentUser.username]
            };
            chatRooms.push(newRoom);
            localStorage.setItem('chatRooms', JSON.stringify(chatRooms));
            updateChatRooms();
        }
    });

    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = '../login/login.html';
    });

    updateChatRooms();
});
