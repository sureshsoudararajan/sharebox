const express = require('express');
const path = require('path');
const fs = require('fs');
const { decrypt } = require('../utils/cryptoUtils');

const router = express.Router();

router.get('/:id', (req, res) => {
  const id = req.params.id;

  // Check for text content
  if (global.db.texts[id]) {
    return res.json({ type: 'text', content: global.db.texts[id] });
  }

  // Check for file content
  if (global.db.files[id]) {
    const fileInfo = global.db.files[id];
    const filePath = fileInfo.path;

    if (fs.existsSync(filePath)) {
      const encryptedBuffer = fs.readFileSync(filePath);
      const decryptedBuffer = decrypt(encryptedBuffer.toString('hex'), fileInfo.iv);

      if (fileInfo.mimetype.startsWith('image/')) {
        res.set('Content-Type', fileInfo.mimetype);
        return res.send(decryptedBuffer);
      } else {
        res.set('Content-Type', fileInfo.mimetype);
        res.set('Content-Disposition', `attachment; filename="${fileInfo.originalname}"`);
        return res.send(decryptedBuffer);
      }
    } else {
      return res.status(404).json({ error: 'File not found.' });
    }
  }

  res.status(404).json({ error: 'Content not found.' });
});

module.exports = router;
