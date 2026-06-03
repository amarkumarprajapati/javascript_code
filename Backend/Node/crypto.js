// What is the Crypto Module?
// The crypto module provides cryptographic functionality including a set of wrappers for OpenSSL's hash, HMAC, cipher, decipher, sign, and verify functions.

const crypto = require('crypto');

// 1. Hash Functions
// Create hash of data using various algorithms

const data = 'Hello, World!';

// SHA-256
const sha256Hash = crypto.createHash('sha256').update(data).digest('hex');
console.log('SHA-256:', sha256Hash);

// MD5
const md5Hash = crypto.createHash('md5').update(data).digest('hex');
console.log('MD5:', md5Hash);

// SHA-512
const sha512Hash = crypto.createHash('sha512').update(data).digest('hex');
console.log('SHA-512:', sha512Hash);

// 2. HMAC (Hash-based Message Authentication Code)
// Create HMAC with a secret key

const secret = 'my-secret-key';
const hmac = crypto.createHmac('sha256', secret).update(data).digest('hex');
console.log('HMAC-SHA256:', hmac);

// 3. Random Values
// Generate cryptographically strong random values

// Random bytes
const randomBytes = crypto.randomBytes(16);
console.log('Random bytes (hex):', randomBytes.toString('hex'));

// Random integer within range
const min = 1;
const max = 100;
const randomInt = crypto.randomInt(min, max);
console.log('Random integer:', randomInt);

// 4. Cipher (Encryption)
// Encrypt data using AES

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32); // 256-bit key
const iv = crypto.randomBytes(16); // 128-bit IV

const cipher = crypto.createCipheriv(algorithm, key, iv);
let encrypted = cipher.update(data, 'utf8', 'hex');
encrypted += cipher.final('hex');
console.log('Encrypted:', encrypted);

// 5. Decipher (Decryption)
// Decrypt the encrypted data

const decipher = crypto.createDecipheriv(algorithm, key, iv);
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
console.log('Decrypted:', decrypted);

// 6. PBKDF2 (Password-Based Key Derivation Function 2)
// Derive a key from a password

const password = 'my-password';
const salt = crypto.randomBytes(16);
const iterations = 100000;
const keyLength = 32;
const digest = 'sha256';

crypto.pbkdf2(password, salt, iterations, keyLength, digest, (err, derivedKey) => {
  if (err) throw err;
  console.log('Derived key (hex):', derivedKey.toString('hex'));
});

// 7. Scrypt (Alternative to PBKDF2)
// Memory-hard key derivation function

crypto.scrypt(password, salt, 64, (err, derivedKey) => {
  if (err) throw err;
  console.log('Scrypt key (hex):', derivedKey.toString('hex'));
});

// 8. Sign and Verify
// Digital signatures using public/private key pairs

// Generate key pair
const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

const signData = 'Important message to sign';

// Sign
const sign = crypto.createSign('sha256');
sign.update(signData);
sign.end();
const signature = sign.sign(privateKey, 'hex');
console.log('Signature:', signature);

// Verify
const verify = crypto.createVerify('sha256');
verify.update(signData);
verify.end();
const isValid = verify.verify(publicKey, signature, 'hex');
console.log('Signature valid:', isValid);

// 9. Diffie-Hellman Key Exchange
// Secure key exchange between parties

const alice = crypto.createDiffieHellman(2048);
const aliceKeys = alice.generateKeys();

const bob = crypto.createDiffieHellman(2048);
const bobKeys = bob.generateKeys();

const aliceSecret = alice.computeSecret(bobKeys);
const bobSecret = bob.computeSecret(aliceKeys);

console.log('Alice secret (hex):', aliceSecret.toString('hex'));
console.log('Bob secret (hex):', bobSecret.toString('hex'));
console.log('Secrets match:', aliceSecret.equals(bobSecret));

// 10. Creating Hash from Stream
// Hash file content using streams

const fs = require('fs');
const hash = crypto.createHash('sha256');
const stream = fs.createReadStream('./renamed.txt');

stream.on('data', (chunk) => {
  hash.update(chunk);
});

stream.on('end', () => {
  const fileHash = hash.digest('hex');
  console.log('File hash (SHA-256):', fileHash);
});

// 11. Timing-Safe String Comparison
// Prevent timing attacks when comparing strings

const string1 = 'secret-value';
const string2 = 'secret-value';

const isMatch = crypto.timingSafeEqual(
  Buffer.from(string1),
  Buffer.from(string2)
);
console.log('Strings match (timing-safe):', isMatch);

// 12. Constant-Time Comparison for HMAC
// Compare HMACs in constant time

const hmac1 = crypto.createHmac('sha256', secret).update(data).digest();
const hmac2 = crypto.createHmac('sha256', secret).update(data).digest();

const hmacMatch = crypto.timingSafeEqual(hmac1, hmac2);
console.log('HMACs match:', hmacMatch);

// 13. Get Supported Algorithms
// List available hash, cipher, and other algorithms

console.log('Hash algorithms:', crypto.getHashes());
console.log('Cipher algorithms:', crypto.getCiphers());
console.log('Curve algorithms:', crypto.getCurves());

// 14. Practical Example: Password Hashing
// Secure password storage using scrypt

function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 64);
  return `${salt.toString('hex')}:${hash.toString('hex')}`;
}

function verifyPassword(password, hashedPassword) {
  const [saltHex, hashHex] = hashedPassword.split(':');
  const salt = Buffer.from(saltHex, 'hex');
  const hash = Buffer.from(hashHex, 'hex');
  const verifyHash = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(hash, verifyHash);
}

const hashedPwd = hashPassword('mySecurePassword123');
console.log('Hashed password:', hashedPwd);
console.log('Password verified:', verifyPassword('mySecurePassword123', hashedPwd));

console.log('Crypto module examples loaded.');
