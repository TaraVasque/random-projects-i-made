//"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"

async function sendMessage() {
    const userInput = document.getElementById('user-input').value.trim();
    if (userInput !== "") {
        // Display the user's message
        displayMessage(userInput, "user");

        // Send the user input to the backend to interact with the Groq AI API
        const botResponse = await getGroqResponse(userInput);

        // Display the bot's response
        displayMessage(botResponse, "bot");

        // Clear input field
        document.getElementById('user-input').value = '';
    }
}

function displayMessage(message, sender) {
    const chatboxBody = document.getElementById('chatbox-body');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(sender === "bot" ? 'bot-message' : 'user-message');
    messageDiv.innerHTML = `<span>${message}</span>`;
    chatboxBody.appendChild(messageDiv);

    // Auto scroll to the bottom
    chatboxBody.scrollTop = chatboxBody.scrollHeight;
}

async function getGroqResponse(userInput) {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userInput })
        });

        const data = await response.json();
        return data.response || "Sorry, I didn't quite catch that.";
    } catch (error) {
        console.error("Error:", error);
        return "Sorry, something went wrong. Please try again.";
    }
}