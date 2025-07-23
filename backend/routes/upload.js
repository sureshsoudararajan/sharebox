const express = require('express');
const multer = require('multer');
const axios = require('axios');
const { encrypt } = require('../utils/cryptoUtils');
const generateId = require('../utils/generateId');

const router = express.Router();

// Configure Multer for file uploads
const upload = multer({
  storage: multer.memoryStorage() // Store file in memory
});

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

// Handle file/image upload
router.post('/file', upload.single('shareFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    const { iv, encryptedData } = encrypt(req.file.buffer);

    const encryptedBuffer = Buffer.from(encryptedData, 'hex');

    const response = await axios.put(`https://transfer.sh/${req.file.originalname}`, encryptedBuffer, {
      headers: {
        'Content-Type': 'application/octet-stream'
      }
    });

    if (response.status === 200 && response.data.trim().startsWith('http')) {
      const id = generateId();
      const type = req.file.mimetype.startsWith('image/') ? 'image' : 'file';
      const fileUrl = response.data.trim();

      global.db.files[id] = {
        url: fileUrl,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        iv: iv
      };
      res.json({ id: id, type: type, originalname: req.file.originalname });
    } else {
      throw new Error('Failed to upload file to 0x0.st');
    }
  } catch (error) {
    console.error('Error uploading file:', error.message);
    res.status(500).json({ error: `An error occurred while sharing the file: ${error.message}` });
  }
});

module.exports = router;
