document.addEventListener('DOMContentLoaded', () => {
    const roomList = document.getElementById('room-list');
    const logoutButton = document.getElementById('logout-button');

    // Example chat rooms (could be loaded from a server or database in a real app)
    const chatRooms = [
        { id: 'room1', name: 'General Chat' },
        { id: 'room2', name: 'Tech Talk' },
        { id: 'room3', name: 'Random' }
    ];

    // Populate chat rooms
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

    // Handle logout
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    });
});

