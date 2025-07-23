const crypto = require('crypto');

function encrypt(buffer) {
  // Encryption disabled for debugging
  return { iv: '', encryptedData: buffer.toString('hex') };
}

function decrypt(encryptedData, ivHex) {
  // Decryption disabled for debugging
  return Buffer.from(encryptedData, 'hex');
}

module.exports = { encrypt, decrypt };
