document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    
    // Add initial greeting
    addBotMessage("Hello! I'm ChatGPT. How can I help you today?");
    
    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    async function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;
        
        // Add user message to chat
        addUserMessage(message);
        userInput.value = '';
        
        // Show loading indicator
        const loadingId = showLoading();
        
        try {
            // Get ChatGPT response
            const response = await fetchChatGPTResponse(message);
            addBotMessage(response);
        } catch (error) {
            console.error('Error:', error);
            addBotMessage("Sorry, I'm having trouble connecting to ChatGPT. Please try again later.");
        } finally {
            removeLoading(loadingId);
        }
    }
    
    async function fetchChatGPTResponse(message) {
        // IMPORTANT: In a production environment, you should call your own backend
        // that has the OpenAI API key, rather than exposing it in client-side code
        
        // This is a placeholder - you'll need to implement your own backend endpoint
        const response = await fetch('YOUR_BACKEND_ENDPOINT', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message
            })
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        return data.reply;
    }
    
    // UI Functions
    function addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'user-message');
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        scrollToBottom();
    }
    
    function addBotMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'bot-message');
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        scrollToBottom();
    }
    
    function showLoading() {
        const loadingElement = document.createElement('div');
        loadingElement.classList.add('message', 'bot-message');
        loadingElement.id = 'loading-' + Date.now();
        
        const loadingText = document.createElement('span');
        loadingText.textContent = 'Thinking';
        loadingElement.appendChild(loadingText);
        
        const loadingIcon = document.createElement('span');
        loadingIcon.classList.add('loading');
        loadingElement.appendChild(loadingIcon);
        
        chatMessages.appendChild(loadingElement);
        scrollToBottom();
        
        return loadingElement.id;
    }
    
    function removeLoading(id) {
        const loadingElement = document.getElementById(id);
        if (loadingElement) {
            loadingElement.remove();
        }
    }
    
    function
