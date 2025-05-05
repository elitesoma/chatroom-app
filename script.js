// Simple in-memory storage for messages (will reset on page refresh)
let messages = [];
let username = 'Anonymous';

// DOM elements
const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const usernameInput = document.getElementById('username-input');

// Load saved username if exists
if (localStorage.getItem('chatUsername')) {
    username = localStorage.getItem('chatUsername');
    usernameInput.value = username;
}

// Display all messages
function displayMessages() {
    messagesContainer.innerHTML = '';
    messages.forEach(msg => {
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.innerHTML = `
            <div class="username">${msg.username}</div>
            <div class="text">${msg.text}</div>
            <div class="time">${new Date(msg.timestamp).toLocaleTimeString()}</div>
        `;
        messagesContainer.appendChild(messageElement);
    });
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Send a new message
function sendMessage() {
    const text = messageInput.value.trim();
    if (text) {
        messages.push({
            username: username,
            text: text,
            timestamp: new Date().getTime()
        });
        messageInput.value = '';
        displayMessages();
        
        // For a real app, you would send to a server here
    }
}

// Event listeners
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

usernameInput.addEventListener('change', () => {
    username = usernameInput.value.trim() || 'Anonymous';
    localStorage.setItem('chatUsername', username);
});

// Initial display
displayMessages();
