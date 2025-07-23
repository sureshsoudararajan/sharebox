const express = require('express');
const axios = require('axios');
const { decrypt } = require('../utils/cryptoUtils');

const router = express.Router();

router.get('/:id', async (req, res) => {
  const id = req.params.id;

  // Check for text content
  if (global.db.texts[id]) {
    return res.json({ type: 'text', content: global.db.texts[id] });
  }

  // Check for file content
  if (global.db.files[id]) {
    const fileInfo = global.db.files[id];
    try {
      const response = await axios.get(fileInfo.url, {
        responseType: 'arraybuffer'
      });

      const decryptedBuffer = response.data;

      res.set('Content-Type', fileInfo.mimetype);
      if (!fileInfo.mimetype.startsWith('image/')) {
        res.set('Content-Disposition', `attachment; filename="${fileInfo.originalname}"`);
      }
      return res.send(decryptedBuffer);
    } catch (error) {
      console.error('Error retrieving file:', error.message);
      return res.status(500).json({ error: 'Failed to retrieve file.' });
    }
  }

  res.status(404).json({ error: 'Content not found.' });
});

module.exports = router;
