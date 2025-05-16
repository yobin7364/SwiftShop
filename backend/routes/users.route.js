import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import keys from '../config/keys.config.js'
import passport from 'passport'
import { validateRegistration } from '../validator/register.validator.js'
import { validateLoginInput } from '../validator/login.validator.js'
import User from '../models/User.module.js'
import Book from '../models/Book.module.js'
import { validateEditUser } from '../validator/edit.validator.js'
import { validateChangePasswordInput } from '../validator/password.validator.js'

const router = express.Router()


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
    next(err)
  }
})

// @route  POST /api/users/login
// @desc   Login user
// @access Public
router.post('/login', (req, res, next) => {
  // Validate input
  const validation = validateLoginInput(req.body)

  if (!validation.success) {
    return res.status(400).json(validation)
  }

  const { email, password, role: selectedRole } = req.body

  // Find user by email
  User.findOne({ email })
    .then((user) => {
      const errors = {}
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
    .catch((err) => next(err))
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

//@route  PUT /api/users/me
router.put(
  '/me',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const { errors, isValid } = validateEditUser(req.body)
    if (!isValid) {
      return res.status(400).json({ success: false, errors })
    }

    try {
      const user = await User.findById(req.user.id)
      if (!user) {
        return res.status(404).json({
          success: false,
          errors: { user: 'User not found' },
        })
      }

      const { name, email } = req.body

      // 🔐 Email uniqueness check
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
          return res.status(400).json({
            success: false,
            errors: { email: 'Email is already in use' },
          })
        }
        user.email = email
      }

      if (name) user.name = name

      await user.save()

      res.status(200).json({
        success: true,
        message: 'User profile updated successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      })
    } catch (err) {
      res.status(500).json({
        success: false,
        errors: { server: 'Server error' },
      })
    }
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
        success: true,
        message: `Role '${role}' added successfully`,
        role: user.role,
      })
    } catch (error) {
      next(error)
    }
  }
)

//@route   PATCH /api/users/change-password
//@desc    Change password for the logged-in user
//@access  Private
router.patch(
  '/change-password',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const validation = validateChangePasswordInput(req.body)

    if (!validation.success) {
      return res.status(400).json(validation)
    }

    const { currentPassword, newPassword, confirmNewPassword } = req.body

    try {
      const user = await User.findById(req.user.id)

      if (!user) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'User not found',
          },
        })
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password)
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Validation failed',
            details: {
              currentPassword: 'Current password is incorrect.',
            },
          },
        })
      }

      const isSamePassword = await bcrypt.compare(newPassword, user.password)
      if (isSamePassword) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Validation failed',
            details: {
              newPassword:
                'New password must be different from the current password.',
            },
          },
        })
      }

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(newPassword, salt)

      user.password = hashedPassword
      await user.save()

      return res
        .status(200)
        .json({ success: true, message: 'Password changed successfully.' })
    } catch (error) {
      next(error)
    }
  }
)

// @route   DELETE /api/users/delete
// @desc    Delete current logged-in user (buyer or seller)
// @access  Private
router.delete(
  '/me',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const userId = req.user.id

      // Optional: If seller, remove their books too
      if (req.user.role.includes('seller')) {
        await Book.deleteMany({ author: userId })
      }

      await User.findByIdAndDelete(userId)

      res
        .status(200)
        .json({ message: 'Your account has been deleted successfully.' })
    } catch (error) {
      console.error('Error deleting user:', error)
      res.status(500).json({
        success: false,
        error: {
          message: 'Server error',
          details: error.message,
        },
      })
    }
  }
)
export default router
