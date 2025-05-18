import mongoose from 'mongoose'

const encryptedBookSchema = new mongoose.Schema({
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true, unique: true },
    aesKey: { type: String, required: true } // base64-encoded AES key
}, { timestamps: true })

const EncryptedBook = mongoose.model('encryptedBook', encryptedBookSchema)

export default EncryptedBook