const crypto = require('crypto');

// WARNING: This key and IV are hardcoded for demonstration purposes.
// In a production environment, these should be securely generated and managed,
// e.g., via environment variables or a key management service.
const ENCRYPTION_KEY = crypto.randomBytes(32); // 256-bit key
const IV_LENGTH = 16; // For AES, this is always 16

function encrypt(buffer) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(buffer);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

function decrypt(encryptedData, ivHex) {
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(Buffer.from(encryptedData, 'hex'));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted;
}

module.exports = { encrypt, decrypt };
