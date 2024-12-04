const express = require('express');
const bodyParser = require('body-parser');
const Groq = require('groq-sdk');

const app = express();
const port = 3000;

// Hard-code your Groq API key here
const groqApiKey = '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'; // Replace with your actual Groq API key

// Initialize the Groq client with your API key
const groq = new Groq({ apiKey: groqApiKey });

app.use(bodyParser.json());

// Serve static files (your HTML, CSS, and JS)
app.use(express.static('public'));

// API endpoint to handle chat requests
app.post('/api/chat', async(req, res) => {
    const userMessage = req.body.message;

    try {
        // Call the Groq API to get a chat completion
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: userMessage }],
            model: 'llama3-8b-8192', // Or use another model if applicable
        });

        // Correct usage of optional chaining
        const botResponse = chatCompletion.choices[0] ?.message ?.content || 'Sorry, I didn’t get that.';

        // Return the bot response
        res.json({ response: botResponse });
    } catch (error) {
        console.error('Error communicating with Groq API:', error);
        res.status(500).json({ response: 'Sorry, there was an error processing your request.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});