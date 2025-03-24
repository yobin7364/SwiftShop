import express from 'express'
import passport from 'passport'
import Merchant from '../models/Merchant.model.js'

const router = express.Router()

// @route   POST /api/merchants
// @desc    Register as a merchant (requires an authenticated user)
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { businessName, businessDescription, contactEmail } = req.body

    try {
      // Check if the user is already a registered merchant
      const existingMerchant = await Merchant.findOne({ user: req.user.id })
      if (existingMerchant) {
        return res
          .status(400)
          .json({ error: 'User is already a registered merchant' })
      }

      // Create and save the new merchant profile
      const newMerchant = new Merchant({
        user: req.user.id,
        businessName,
        businessDescription,
        contactEmail,
      })

      const savedMerchant = await newMerchant.save()
      res.json(savedMerchant)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Server error' })
    }
  }
)

// @route   GET /api/merchants/current
// @desc    Get the current merchant profile for the authenticated user
// @access  Private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const merchant = await Merchant.findOne({ user: req.user.id })
      if (!merchant) {
        return res.status(404).json({ error: 'Merchant profile not found' })
      }
      res.json(merchant)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Server error' })
    }
  }
)

// @route   PUT /api/merchants/:id
// @desc    Update merchant profile (only by the owner)
// @access  Private
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const merchant = await Merchant.findById(req.params.id)
      if (!merchant) {
        return res.status(404).json({ error: 'Merchant profile not found' })
      }

      // Ensure the authenticated user is the owner of this merchant profile
      if (merchant.user.toString() !== req.user.id) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      // Update the merchant fields
      merchant.businessName = req.body.businessName || merchant.businessName
      merchant.businessDescription =
        req.body.businessDescription || merchant.businessDescription
      merchant.contactEmail = req.body.contactEmail || merchant.contactEmail

      const updatedMerchant = await merchant.save()
      res.json(updatedMerchant)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Server error' })
    }
  }
)

// @route   GET /api/merchants/:id
// @desc    Get a merchant profile by merchant ID (public access)
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const merchant = await Merchant.findById(req.params.id).populate(
      'user',
      'name email'
    )
    if (!merchant) {
      return res.status(404).json({ error: 'Merchant profile not found' })
    }
    res.json(merchant)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
