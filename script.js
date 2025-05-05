// script.js
const HF_API_KEY = localStorage.getItem('hf_api_key') || prompt("Enter your Hugging Face API key:");
if (!HF_API_KEY) {
    alert("API key is required to use the chatbot!");
} else {
    localStorage.setItem('hf_api_key', HF_API_KEY); // Store for next session
}

async function getAIResponse(message) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputs: message })
        }
    );
    
    if (response.status === 401) {
        localStorage.removeItem('hf_api_key'); // Clear invalid key
        throw new Error("Invalid API key. Please refresh and re-enter.");
    }
    
    return await response.json();
}
