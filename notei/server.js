const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const multer = require('multer');

const app = express();
const port = 3000;

// Set up storage for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folderPath = path.join(__dirname, 'notes', req.body.index);
        fs.ensureDirSync(folderPath);  // Ensure the note folder exists
        cb(null, folderPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Save image with its original name
    }
});
const upload = multer({ storage: storage });

app.use(express.static('public'));
app.use(express.json()); // Parse JSON bodies

// API to save a note
app.post('/saveNote', upload.single('image'), (req, res) => {
    const { index, content } = req.body;
    const noteFolderPath = path.join(__dirname, 'notes', index);
    
    // Save the note content to a .txt file
    const noteContentPath = path.join(noteFolderPath, `${index}.txt`);
    fs.writeFileSync(noteContentPath, content);

    // Respond to the client
    res.json({ message: 'Note saved successfully', success: true });
});

// API to view all notes
app.get('/viewNotes', (req, res) => {
    const notesDirectory = path.join(__dirname, 'notes');
    const notes = [];

    fs.readdirSync(notesDirectory).forEach((folder) => {
        const noteFolderPath = path.join(notesDirectory, folder);
        const txtFile = path.join(noteFolderPath, `${folder}.txt`);
        if (fs.existsSync(txtFile)) {
            const content = fs.readFileSync(txtFile, 'utf-8');
            const image = fs.readdirSync(noteFolderPath).find(file => file.match(/\.(jpg|jpeg|png|gif)$/));
            const imageUrl = image ? `/notes/${folder}/${image}` : null;
            notes.push({ index: folder, content, image: imageUrl });
        }
    });

    res.json(notes);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
