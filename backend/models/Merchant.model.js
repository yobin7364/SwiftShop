import mongoose from 'mongoose'
const { Schema } = mongoose

const MerchantSchema = new Schema(
  {
    // Referring to the user account that acts as the merchant
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    businessName: { type: String, required: true },
    businessDescription: { type: String },
    contactEmail: { type: String },
  },
  { timestamps: true }
)

const Merchant = mongoose.model('Merchant', MerchantSchema)
export default Merchant
