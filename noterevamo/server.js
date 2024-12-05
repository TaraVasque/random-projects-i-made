const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const NOTES_FOLDER = path.join(__dirname, 'notes');

// Create 'notes' folder if it doesn't exist
if (!fs.existsSync(NOTES_FOLDER)) {
  fs.mkdirSync(NOTES_FOLDER);
}

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Save a new note
app.post('/api/notes', (req, res) => {
  const { name, text, image } = req.body;
  const filePath = path.join(NOTES_FOLDER, `${name}.json`);

  if (!name || !text) {
    return res.status(400).json({ error: 'Note name and text are required.' });
  }

  const note = {
    name,
    text,
    image: image || null,  // If no image, set to null
  };

  fs.writeFile(filePath, JSON.stringify(note, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to save the note.' });
    }
    res.status(200).json({ message: 'Note saved successfully.' });
  });
});

// Get a specific note
app.get('/api/notes/:name', (req, res) => {
  const noteName = req.params.name;
  const filePath = path.join(NOTES_FOLDER, `${noteName}.json`);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(404).json({ error: 'Note not found.' });
    }
    res.status(200).json(JSON.parse(data));
  });
});

// Get all note names
app.get('/api/notes', (req, res) => {
  fs.readdir(NOTES_FOLDER, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read notes folder.' });
    }
    const noteNames = files.map(file => path.basename(file, '.json'));
    res.status(200).json(noteNames);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
