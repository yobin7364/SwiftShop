import crypto from 'crypto'

// AES based encryption
export const aesEncrypt = (key, plaintext) => {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
    return Buffer.concat([iv, encrypted]).toString('base64')
}
