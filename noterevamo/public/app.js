// Function to fetch saved notes from local storage
function fetchSavedNotes() {
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    const noteList = document.getElementById('note-list');
    noteList.innerHTML = ''; // Clear the list before adding the new ones

    savedNotes.forEach(note => {
        const li = document.createElement('li');
        li.textContent = note.name; // Display note name in the list
        li.addEventListener('click', () => {
            // Update the view when the note is clicked
            viewNoteContent(note.name);
        });
        noteList.appendChild(li);
    });
}

// Function to save a note to localStorage
function saveNote() {
    const noteName = document.getElementById('note-name').value;
    const noteText = document.getElementById('note-text').value;
    const noteImage = document.getElementById('note-image').files[0];

    if (!noteName || !noteText) {
        alert('Note name and text are required!');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const noteData = {
            name: noteName,
            text: noteText,
            image: e.target.result // Convert image to base64
        };

        // Get saved notes from localStorage
        const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
        savedNotes.push(noteData);

        // Save updated notes back to localStorage
        localStorage.setItem('notes', JSON.stringify(savedNotes));

        alert('Note saved successfully!');
        fetchSavedNotes(); // Refresh the note list
    };

    if (noteImage) {
        reader.readAsDataURL(noteImage); // Convert image to base64
    } else {
        // Save note without image
        const noteData = { name: noteName, text: noteText, image: null };

        // Get saved notes from localStorage
        const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
        savedNotes.push(noteData);

        // Save updated notes back to localStorage
        localStorage.setItem('notes', JSON.stringify(savedNotes));

        alert('Note saved successfully!');
        fetchSavedNotes(); // Refresh the note list
    }
}

// Function to view a specific note content
function viewNoteContent(noteName) {
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    const note = savedNotes.find(note => note.name === noteName);

    if (note) {
        const viewNoteContent = document.getElementById('view-note-content');
        viewNoteContent.innerHTML = `
            <h3>${note.name}</h3>
            <p>${note.text}</p>
            ${note.image ? `<img src="${note.image}" alt="Note Image" />` : ''}
        `;
    } else {
        alert('Note not found!');
    }
}

// Event listeners for buttons
if (document.getElementById('save-note-btn')) {
    document.getElementById('save-note-btn').addEventListener('click', saveNote);
}

if (document.getElementById('view-note-btn')) {
    document.getElementById('view-note-btn').addEventListener('click', () => {
        const noteName = document.getElementById('view-note-name').value;
        if (noteName) {
            viewNoteContent(noteName);
        } else {
            alert('Please enter a note name!');
        }
    });
}

// Initial setup on page load
window.addEventListener('load', () => {
    if (document.getElementById('note-list')) {
        fetchSavedNotes(); // Load saved notes for the Save page
    }
});
// Function to load the navbar into the page
function loadNavbar() {
    const navbarContainer = document.getElementById('navbar-container');
    fetch('navbar.html')
        .then(response => response.text())
        .then(navbarHtml => {
            navbarContainer.innerHTML = navbarHtml;
        })
        .catch(err => {
            console.error('Error loading navbar:', err);
        });
}

// Function to navigate between pages (using URL hashes)
function navigateTo(page) {
    switch (page) {
        case 'create':
            window.location.href = 'create.html';
            break;
        case 'view':
            window.location.href = 'view.html';
            break;
        case 'save':
            window.location.href = 'save.html';
            break;
        default:
            console.log('Unknown page:', page);
    }
}

// Call the loadNavbar function when the page loads
window.addEventListener('load', loadNavbar);
