document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    
    // Hugging Face API configuration
    const HF_API_KEY = "YOUR_HUGGING_FACE_API_KEY"; // Replace with your actual key
    const HF_MODEL = "microsoft/DialoGPT-medium"; // Good conversational model
    
    // Add initial bot greeting
    addBotMessage("Hello! I'm an AI assistant powered by Hugging Face. How can I help you today?");
    
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
            // Get AI response
            const response = await getAIResponse(message);
            addBotMessage(response);
        } catch (error) {
            console.error("AI Error:", error);
            addBotMessage("Sorry, I'm having trouble connecting to the AI service.");
        } finally {
            removeLoading(loadingId);
        }
    }
    
    async function getAIResponse(userMessage) {
        // For Hugging Face Inference API
        const response = await fetch(
            `https://api-inference.huggingface.co/models/${HF_MODEL}`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${HF_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    inputs: {
                        "past_user_inputs": getPastUserInputs(),
                        "generated_responses": getPastBotResponses(),
                        "text": userMessage
                    },
                    parameters: {
                        "max_length": 1000,
                        "temperature": 0.9,
                        "repetition_penalty": 1.2
                    }
                }),
            }
        );
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        return data.generated_text || "I'm not sure how to respond to that.";
    }
    
    // Helper functions to maintain conversation context
    function getPastUserInputs() {
        const userMessages = document.querySelectorAll('.user-message');
        return Array.from(userMessages).slice(-3).map(el => el.textContent);
    }
    
    function getPastBotResponses() {
        const botMessages = document.querySelectorAll('.bot-message:not(.loading-indicator)');
        return Array.from(botMessages).slice(-3).map(el => el.textContent);
    }
    
    // UI Functions (unchanged from previous version)
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
        loadingElement.classList.add('message', 'bot-message', 'loading-indicator');
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
    
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});
