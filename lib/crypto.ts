/**
 * Client-side encryption utilities
 * All encryption/decryption happens in the browser
 * Server only sees encrypted blobs
 */

/**
 * Derive an encryption key from a password using PBKDF2
 * This is used to encrypt/decrypt the Data Encryption Key (DEK)
 */
export async function deriveKeyFromPassword(
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );

  // Ensure salt is a proper BufferSource by creating a new Uint8Array
  const saltBuffer = new Uint8Array(salt);

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations: 100000, // High iteration count for security
      hash: "SHA-256",
    },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Generate a random Data Encryption Key (DEK)
 * This key is used to encrypt user data
 */
export async function generateDEK(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true, // extractable
    ["encrypt", "decrypt"]
  );
}

/**
 * Export a key to a base64 string for storage
 */
export async function exportKey(key: CryptoKey): Promise<string> {
  const exported = await crypto.subtle.exportKey("raw", key);
  const exportedArrayBuffer = new Uint8Array(exported);
  return btoa(String.fromCharCode(...exportedArrayBuffer));
}

/**
 * Import a key from a base64 string
 */
export async function importKey(keyString: string): Promise<CryptoKey> {
  const keyArray = Uint8Array.from(atob(keyString), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey(
    "raw",
    keyArray,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypt the DEK with a password-derived key
 * Returns: { encryptedDEK: base64 string, salt: base64 string }
 */
export async function encryptDEK(
  dek: CryptoKey,
  password: string
): Promise<{ encryptedDEK: string; salt: string }> {
  // Generate a random salt
  const salt = crypto.getRandomValues(new Uint8Array(16));

  // Derive key from password
  const passwordKey = await deriveKeyFromPassword(password, salt);

  // Export DEK to raw format
  const dekRaw = await crypto.subtle.exportKey("raw", dek);
  const dekArray = new Uint8Array(dekRaw);

  // Generate IV for encryption
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Encrypt the DEK
  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    passwordKey,
    dekArray
  );

  // Combine IV + encrypted data
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.length);

  return {
    encryptedDEK: btoa(String.fromCharCode(...combined)),
    salt: btoa(String.fromCharCode(...salt)),
  };
}

/**
 * Decrypt the DEK using a password
 * Returns the decrypted DEK CryptoKey
 */
export async function decryptDEK(
  encryptedDEK: string,
  salt: string,
  password: string
): Promise<CryptoKey> {
  // Decode salt and encrypted data
  const saltArray = Uint8Array.from(atob(salt), (c) => c.charCodeAt(0));
  const encryptedArray = Uint8Array.from(atob(encryptedDEK), (c) =>
    c.charCodeAt(0)
  );

  // Extract IV (first 12 bytes) and encrypted data
  const iv = encryptedArray.slice(0, 12);
  const encrypted = encryptedArray.slice(12);

  // Derive key from password
  const passwordKey = await deriveKeyFromPassword(password, saltArray);

  // Decrypt the DEK
  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    passwordKey,
    encrypted
  );

  // Import the decrypted DEK
  return importKey(btoa(String.fromCharCode(...new Uint8Array(decrypted))));
}

/**
 * Encrypt data using the DEK
 * Returns base64 encrypted string
 */
export async function encryptData(dek: CryptoKey, data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataArray = encoder.encode(data);

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    dek,
    dataArray
  );

  // Combine IV + encrypted data
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.length);

  return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypt data using the DEK
 * Returns decrypted string
 */
export async function decryptData(dek: CryptoKey, encryptedData: string): Promise<string> {
  const encryptedArray = Uint8Array.from(atob(encryptedData), (c) =>
    c.charCodeAt(0)
  );

  const iv = encryptedArray.slice(0, 12);
  const encrypted = encryptedArray.slice(12);

  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    dek,
    encrypted
  );

  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}
