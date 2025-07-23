const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { encrypt } = require('../utils/cryptoUtils');
const generateId = require('../utils/generateId');

const router = express.Router();

// Configure Multer for file uploads
const upload = multer({
  storage: multer.memoryStorage() // Store file in memory to encrypt before saving
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
router.post('/file', upload.single('shareFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  const id = generateId();
  const type = req.file.mimetype.startsWith('image/') ? 'image' : 'file';
  const ext = path.extname(req.file.originalname);
  const filename = id + ext;
  const storagePath = type === 'image' ? path.join(__dirname, '../storage/images') : path.join(__dirname, '../storage/files');
  const filePath = path.join(storagePath, filename);

  const { iv, encryptedData } = encrypt(req.file.buffer);

  fs.writeFileSync(filePath, Buffer.from(encryptedData, 'hex'));

  global.db.files[id] = {
    filename: filename,
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    path: filePath,
    iv: iv
  };
  res.json({ id: id, type: type, originalname: req.file.originalname });
});

module.exports = router;
