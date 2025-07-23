const express = require('express');
const generateId = require('../utils/generateId');

const router = express.Router();

// Handle text upload
router.post('/text', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text content is required.' });
  }
  const id = generateId();
  global.db.texts[id] = text;
  res.json({ id: id, type: 'text' });
});

module.exports = router;
