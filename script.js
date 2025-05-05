document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    
    // Add initial greeting
    addBotMessage("Hello! I'm ChatGPT. How can I help you today?");
    
    // Event listeners with better error handling
    sendButton.addEventListener('click', handleSendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleSendMessage();
    });
    
    async function handleSendMessage() {
        try {
            const message = userInput.value.trim();
            if (!message) {
                alert("Please enter a message");
                return;
            }
            
            addUserMessage(message);
            userInput.value = '';
            userInput.disabled = true;
            sendButton.disabled = true;
            
            const loadingId = showLoading();
            
            // Using a free proxy to OpenAI (for testing only)
            const response = await fetchChatGPTResponse(message);
            addBotMessage(response);
            
        } catch (error) {
            console.error('Chat Error:', error);
            addBotMessage("Error: " + error.message);
        } finally {
            removeLoading(loadingId);
            userInput.disabled = false;
            sendButton.disabled = false;
            userInput.focus();
        }
    }
    
    async function fetchChatGPTResponse(message) {
        // TESTING OPTION 1: Free temporary proxy (limited use)
        const testResponse = await fetch("https://chatgpt-api.shn.hk/v1/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{role: "user", content: message}]
            })
        });
        
        if (!testResponse.ok) {
            throw new Error("Failed to get response");
        }
        
        const data = await testResponse.json();
        return data.choices[0].message.content;
        
        /* 
        // PRODUCTION OPTION 2: Your own backend
        const response = await fetch('YOUR_BACKEND_ENDPOINT', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        
        if (!response.ok) throw new Error('API Error');
        return await response.json();
        */
    }
    
    // UI Helper Functions (same as before)
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
        loadingElement.innerHTML = 'Thinking <span class="loading"></span>';
        chatMessages.appendChild(loadingElement);
        scrollToBottom();
        return loadingElement.id;
    }
    
    function removeLoading(id) {
        const element = document.getElementById(id);
        if (element) element.remove();
    }
    
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});
