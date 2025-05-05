import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import users from './routes/users.route.js'
import book from './routes/seller/book.route.js'
import mongoose from 'mongoose'
import keys from './config/keys.config.js'
import passport from 'passport'
import initializePassport from './config/passport.config.js'
import orderRoutes from './routes/seller/order.route.js'
import dashboardRoutes from './routes/seller/dashboard.route.js'
import { errorHandler } from '../backend/middleware/errorHandler.js'

dotenv.config()

const app = express()

// Initialize Passport strategy
initializePassport()

// Initialize Passport middleware
app.use(passport.initialize())

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const mongoURI = keys.mongoURI

//connect to mongoDB
mongoose
  .connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('Mongoose connection error:', err))

//Use routes
app.use('/api/users', users)
app.use('/api/book', book)
app.use('/api/order', orderRoutes)
app.use('/api/seller', dashboardRoutes)
app.use(errorHandler)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
