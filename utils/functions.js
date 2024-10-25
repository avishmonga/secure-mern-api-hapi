const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const secretKey = crypto.scryptSync(
  process.env.ENCRYPTION_PASSWORD,
  'salt',
  32
);

/**
 * Encrypt a string using AES-256-CBC encryption algorithm.
 *
 * @param {string} string - The plain text string to encrypt.
 * @returns {string} The encrypted string with length prefixes.
 */
const encryptString = (string) => {
  const iv = crypto.randomBytes(16); // Generate a random IV for each encryption
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(string, 'utf-8', 'base64');
  encrypted += cipher.final('base64');

  // Prefix each section with its length
  const ivLength = iv.length; // Length of the IV in bytes
  const encryptedLength = Buffer.byteLength(encrypted, 'base64'); // Length of encrypted text

  // Concatenate lengths and values
  return `${ivLength}:${iv.toString('base64')}:${encryptedLength}:${encrypted}`;
};
/**
 * Decrypt an encrypted string using AES-256-CBC decryption algorithm.
 *
 * @param {string} string - The encrypted string with length prefixes.
 * @returns {string} The decrypted plain text string.
 */
const decryptString = (string) => {
  const parts = string.split(':'); // Split the string into parts using ':' as a delimiter

  // Ensure there are enough parts for IV and encrypted text
  if (parts.length < 4) {
    throw new Error('Invalid encrypted string format');
  }

  const ivString = parts[1]; // The second part is the IV in base64
  const encryptedLength = parseInt(parts[2], 10); // Get the length of the encrypted text

  // Check if the byte length of the encrypted text matches the expected length
  if (Buffer.byteLength(parts[3], 'base64') !== encryptedLength) {
    throw new Error('Invalid encrypted text length');
  }

  const ivBuffer = Buffer.from(ivString, 'base64'); // Convert the IV string back from base64
  const decipher = crypto.createDecipheriv(algorithm, secretKey, ivBuffer); // Create decipher using IV
  let decrypted = decipher.update(parts[3], 'base64', 'utf-8'); // Decrypt the encrypted text
  decrypted += decipher.final('utf-8'); // Finalize the decryption
  return decrypted; // Return the decrypted plain text
};

module.exports = { encryptString, decryptString };
