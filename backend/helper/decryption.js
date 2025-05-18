import crypto from 'crypto'
// Descryption method to obtain book content
export const aesDecrypt = (key, ciphertextBase64) => {
    const ciphertext = Buffer.from(ciphertextBase64, 'base64')
    const iv = ciphertext.slice(0, 16)
    const encrypted = ciphertext.slice(16)
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])
    return decrypted.toString('utf8')
}   