const express = require('express');

const router = express.Router();

router.get('/:id', (req, res) => {
  const id = req.params.id;

  // Check for text content
  if (global.db.texts[id]) {
    return res.json({ type: 'text', content: global.db.texts[id] });
  }

  res.status(404).json({ error: 'Content not found.' });
});

module.exports = router;
