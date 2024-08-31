document.addEventListener('DOMContentLoaded', () => {
    const roomList = document.getElementById('room-list');
    const logoutButton = document.getElementById('logout-button');
    const createRoomButton = document.getElementById('create-room-button');
    const createRoomForm = document.getElementById('create-room-form');
    const newRoomNameInput = document.getElementById('new-room-name');

    // Load chat rooms from local storage or initialize if empty
    let chatRooms = JSON.parse(localStorage.getItem('chatRooms') || '[]');

    // Populate chat rooms
    function populateChatRooms() {
        roomList.innerHTML = '';
        chatRooms.forEach(room => {
            const listItem = document.createElement('li');
            listItem.textContent = room.name;
            listItem.dataset.roomId = room.id;
            listItem.classList.add('chat-room');
            listItem.addEventListener('click', () => {
                window.location.href = `chat.html?room=${room.id}`;
            });
            roomList.appendChild(listItem);
        });
    }

    populateChatRooms();

    // Handle logout
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('currentUser'); // Clear user data
        window.location.href = 'login.html'; // Redirect to login page
    });

    // Handle create room
    createRoomButton.addEventListener('click', () => {
        createRoomForm.style.display = 'block';
    });

    createRoomForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const roomName = newRoomNameInput.value.trim();
        if (roomName) {
            const newRoom = {
                id: `room${chatRooms.length + 1}`,
                name: roomName
            };
            chatRooms.push(newRoom);
            localStorage.setItem('chatRooms', JSON.stringify(chatRooms));
            populateChatRooms();
            createRoomForm.style.display = 'none';
            newRoomNameInput.value = '';
        }
    });
});
