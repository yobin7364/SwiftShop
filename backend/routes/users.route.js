import express from 'express'
const router = express.Router()
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import keys from '../config/keys.config.js'
import passport from 'passport'
import { validateRegistration } from '../validator/register.validator.js'
import { validateLoginInput } from '../validator/login.validator.js'
import User from '../models/User.module.js'
import { validateChangePasswordInput } from '../validator/password.validator.js'

// Access the secretOrKey from the dynamically imported keys
const secret = keys.secretOrKey

//this points to /api/users/test or any route ending with /test
//@route  GET /api/users/test
//@desc   Tests post route
//@access Public
router.get('/test', (req, res) => res.json({ msg: 'User Works' }))

// @route  POST /api/users/register
// @desc   Register user
// @access Public
router.post('/register', async (req, res) => {
  const { errors, isValid } = validateRegistration(req.body)

  // Check validation
  if (!isValid) {
    return res.status(400).json({
      success: false,
      errors,
    })
  }

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email: req.body.email })
    if (existingUser) {
      errors.email = 'This email is already registered.'
      return res.status(400).json({
        success: false,
        errors,
      })
    }

    // Create new user instance
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: [req.body.role],
    })

    // Hash password and save user
    const salt = await bcrypt.genSalt(10)
    newUser.password = await bcrypt.hash(newUser.password, salt)

    const savedUser = await newUser.save()
    return res.json({
      success: true,
      message: 'User registered successfully',
      user: savedUser,
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      errors: 'Server error',
    })
  }
})

// @route  POST /api/users/login
// @desc   Login user
// @access Public
router.post('/login', (req, res) => {
  // Validate input
  const { errors, isValid } = validateLoginInput(req.body)

  // Check if validation fails
  if (!isValid) {
    return res.status(400).json({
      success: false,
      errors,
    })
  }

  const { email, password, role: selectedRole } = req.body

  // Find user by email
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        errors.email = 'Email not found'
        return res.status(400).json({
          success: false,
          errors,
        })
      }

      // Check password
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          if (!user.role.includes(selectedRole)) {
            errors.role = `User does not have role: ${selectedRole}`
            return res.status(400).json({
              success: false,
              errors,
            })
          }

          // User matched
          const payload = { id: user.id, name: user.name, role: user.role } // JWT payload

          // Sign token
          jwt.sign(
            payload,
            secret,
            { expiresIn: '7d' }, // Token expires in 7 days
            (err, token) => {
              if (err) {
                return res
                  .status(500)
                  .json({ success: false, error: 'Error signing the token' })
              }

              res.json({
                success: true,
                token: 'Bearer ' + token, // Bearer token with a space after 'Bearer'
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  role: user.role, // Send role in response
                  selectedRole,
                },
              })
            }
          )
        } else {
          errors.password = 'Password incorrect'
          return res.status(400).json({
            success: false,
            errors,
          })
        }
      })
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        errors: 'Server error',
      })
    })
})

//@route  GET /api/users/current
//@desc   Return current user
//@access Private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: [req.user.role],
    })
  }
)

// @route   PATCH /api/users/upgrade
// @desc    Upgrade user role (e.g., add 'seller' role)
// @access  Private (requires authentication)
router.patch(
  '/upgrade',

  // Authenticate using JWT without sessions (stateless authentication)
  passport.authenticate('jwt', { session: false }),

  async (req, res) => {
    try {
      const { role } = req.body
      const validRoles = ['buyer', 'seller']

      if (!validRoles.includes(role)) {
        return res.status(400).json({ error: 'Invalid role' })
      }

      // Get authenticated user from middleware
      const user = await User.findById(req.user.id)

      if (!user) {
        errors.email = 'Email not found'
        return res.status(400).json({
          success: false,
          errors,
        })
      }

      // Check if the role already exists
      if (user.role.includes(role)) {
        errors.role = `You already have the '${role}' role`
        return res.status(400).json({
          success: false,
          errors,
        })
      }

      // Add the new role
      user.role.push(role)
      await user.save()

      res.json({
        message: `Role '${role}' added successfully`,
        role: user.role,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Server error' })
    }
  }
)

//@route   PATCH /api/users/change-password
//@desc    Change password for the logged-in user
//@access  Private
router.patch(
  '/change-password',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateChangePasswordInput(req.body)

    if (!isValid) {
      return res.status(400).json({ errors })
    }

    const { currentPassword, newPassword, confirmNewPassword } = req.body

    // Validate input
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: 'All fields are required.' })
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: 'New password must be at least 6 characters long.' })
    }

    if (newPassword !== confirmNewPassword) {
      return res
        .status(400)
        .json({ message: 'New password and confirm password do not match.' })
    }

    try {
      const user = await User.findById(req.user.id)

      if (!user) {
        return res.status(404).json({ message: 'User not found.' })
      }

      // Check if currentPassword is correct
      const isMatch = await bcrypt.compare(currentPassword, user.password)
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: 'Current password is incorrect.' })
      }
      // Check if new password is same as old password
      const isSamePassword = await bcrypt.compare(newPassword, user.password)
      if (isSamePassword) {
        return res.status(400).json({
          message: 'New password must be different from the current password.',
        })
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(newPassword, salt)

      // Update password
      user.password = hashedPassword
      await user.save()

      return res.status(200).json({ message: 'Password changed successfully.' })
    } catch (error) {
      console.error('Error changing password:', error)
      return res
        .status(500)
        .json({ message: 'Server error', error: error.message })
    }
  }
)

export default router
