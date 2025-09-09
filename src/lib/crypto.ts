import CryptoJS from 'crypto-js'

function validateEncryptionKey() {
  const key = process.env.ENCRYPTION_KEY
  if (!key || key.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be exactly 32 characters')
  }
  return key
}

export function encrypt(text: string): string {
  const ENCRYPTION_KEY = validateEncryptionKey()
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString()
}

export function decrypt(encryptedText: string): string {
  const ENCRYPTION_KEY = validateEncryptionKey()
  const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY)
  return bytes.toString(CryptoJS.enc.Utf8)
}

export function generateNonce(): string {
  return CryptoJS.lib.WordArray.random(16).toString()
}