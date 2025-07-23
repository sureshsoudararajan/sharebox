const express = require('express');
const path = require('path');
const uploadRoute = require('./routes/upload');
const retrieveRoute = require('./routes/retrieve');

const app = express();
const port = 3000;

// In-memory database
global.db = {
  texts: {},
  files: {}
};

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/upload', uploadRoute);
app.use('/retrieve', retrieveRoute);

// Serve frontend files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/result', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/result.html'));
});

app.get('/view', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/view.html'));
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
