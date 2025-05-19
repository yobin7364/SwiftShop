import mongoose from 'mongoose'

const aesBookSchema = new mongoose.Schema({
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true, unique: true },
    aesKey: { type: String, required: true } // base64-encoded AES key
}, { timestamps: true })

const AesBook = mongoose.model('aesBook', aesBookSchema)

export default AesBook