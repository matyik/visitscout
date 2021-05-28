import express from 'express'
const app = express()
import dotenv from 'dotenv'
import 'colors'
import morgan from 'morgan'

// Security
import cors from 'cors'
import helmet from 'helmet'
import hpp from 'hpp'
import xss from 'xss-clean'
import rateLimit from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'

import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import connectDB from './config/db.js'
import errorHandler from './middleware/error.js'
import websites from './routes/websites.js'
import auth from './routes/auth.js'
import users from './routes/users.js'

dotenv.config({ path: './config/config.env' })

connectDB()

const PORT = process.env.PORT || 5000
app.listen(PORT),
  console.log(
    `API running in ${process.env.NODE_ENV} mode on port ${PORT}`.green.bold
  )

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Body Parser
app.use(express.json())

// Sanitize Data
app.use(mongoSanitize())

// Set security headers
app.use(helmet())

// Prevent XSS attacks
app.use(xss())

// CORS
app.use(cors())

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 Mins
  max: 50
})
app.use(limiter)

// Prevent http param pollution
app.use(hpp())

app.use('/api/website', websites)
app.use('/api/auth', auth)
app.use('/api/users', users)

app.get('/tracker', function (req, res) {
  res.sendFile(__dirname + '/tracker.js')
})

app.use(errorHandler)
