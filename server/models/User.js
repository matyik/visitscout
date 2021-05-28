import mongoose from 'mongoose'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: [true, 'There is already an account with that email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email address'
    ],
    maxlength: [50, 'Email must be under 50 characters']
  },
  role: {
    type: String,
    enum: ['user'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [8, 'Password must be at least 8 characters'],
    maxlength: [150, 'Password must be under 150 characters'],
    select: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Hash password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  })
}

// Match password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex')

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000

  return resetToken
}

export default mongoose.model('User', UserSchema)
