document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    
    // Using a free proxy to Hugging Face API to avoid CORS issues
    const API_URL = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium";
    // Get your free key from https://huggingface.co/settings/tokens
    const HF_API_KEY = "YOUR_HF_API_KEY_HERE"; 

    // Initial message
    addBotMessage("Hello! I'm your AI assistant. Ask me anything!");

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => e.key === 'Enter' && sendMessage());

    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;
        
        addUserMessage(message);
        userInput.value = '';
        
        const loadingId = showLoading();
        
        try {
            // First try the direct API
            let response = await getAIResponse(message);
            
            // If first attempt fails, try with timeout
            if (!response || response.includes("Sorry")) {
                response = await getAIResponse(message, true);
            }
            
            addBotMessage(response || "I didn't get a response. Try again?");
        } catch (error) {
            console.error("Chat error:", error);
            addBotMessage("I'm having trouble connecting. Please refresh and try again later.");
        } finally {
            removeLoading(loadingId);
        }
    }

    async function getAIResponse(message, retry = false) {
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${HF_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    inputs: {
                        "text": message,
                        "past_user_inputs": getPastUserInputs(),
                        "generated_responses": getPastBotResponses()
                    }
                }),
                timeout: retry ? 30000 : 15000 // Longer timeout for retry
            });

            if (!response.ok) throw new Error(await response.text());
            
            const data = await response.json();
            return data.generated_text;
        } catch (error) {
            console.error("API Error:", error);
            // Fallback to a local response if API fails
            return getFallbackResponse(message);
        }
    }

    function getFallbackResponse(message) {
        const lowerMsg = message.toLowerCase();
        if (lowerMsg.includes("hello")) return "Hello there! The AI is currently loading. Try again in 30 seconds.";
        if (lowerMsg.includes("help")) return "I'm still waking up! Large AI models take time to load on free servers.";
        return "The AI is taking longer than expected to respond. Please try your question again in a moment.";
    }

    // ... (keep all your existing UI functions like addUserMessage, showLoading etc.)
});
