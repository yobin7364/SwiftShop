import express from 'express'
import mongoose from 'mongoose'

import EncryptedBook from '../../models/AesBook.module.js'
import Book from '../../models/Book.module.js'

const router = express.Router()

router.post('/send-public-keys', async (req, res) => {
    try {
        const { publicKeys } = req.body
        if (!Array.isArray(publicKeys)) {
            return res.status(400).json({ error: 'Invalid public keys format' })
        }

        const books = await Book.find().sort({ createdAt: -1 })
        const aesKeys = await BookKey.find({ bookId: { $in: books.map(b => b._id) } })

        if (publicKeys.length !== books.length || books.length !== aesKeys.length) {
            return res.status(400).json({ error: 'Mismatch in number of keys and books' })
        }

        const rsaEncryptedKeys = []
        const aesCiphertexts = []

        for (let i = 0; i < books.length; i++) {
            const pubKey = forge.pki.publicKeyFromPem(publicKeys[i])
            const aesKey = Buffer.from(aesKeys.find(k => k.bookId.equals(books[i]._id)).aesKey, 'base64')

            const encryptedAES = pubKey.encrypt(aesKey.toString('binary'), 'RSA-OAEP')
            rsaEncryptedKeys.push(Buffer.from(encryptedAES, 'binary').toString('base64'))
            aesCiphertexts.push(books[i].file.filePath) // already AES-encrypted
        }

        res.json({ rsaEncryptedKeys, aesCiphertexts })
    } catch (error) {
        console.error('Error in /send-public-keys:', error)
        res.status(500).json({ error: 'Server error during OT key exchange' })
    }
})