import { createHash } from 'crypto'
import User from '../models/User.js'
import Website from '../models/Website.js'
import sendEmail from '../utils/sendEmail.js'
import asyncHandler from '../middleware/async.js'
import ErrorResponse from '../utils/errorResponse.js'
import advancedResults from '../middleware/advancedResults.js'

export const register = asyncHandler(async (req, res, next) => {
  const { email, role, password } = req.body

  // Create user
  const user = await User.create({
    email,
    role,
    password
  })

  sendTokenResponse(user, 200, res)
})

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  // Validate email and password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide a email and password', 400))
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    return next(new ErrorResponse('No user found with that email', 401))
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password)

  if (!isMatch) {
    return next(new ErrorResponse('Incorrect password'))
  }

  sendTokenResponse(user, 200, res)
})

export const logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  })

  res.status(200).json({ success: true, data: {} })
})

export const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)
  const websites = await Website.find({ user: req.user.id })

  let userData = { user, websites }

  res.status(200).json({ success: true, data: userData })
})

export const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404))
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken()
  await user.save({ validatorBeforeSave: false })

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/auth/resetpassword/${resetToken}`

  const message = `You have requested to change your password. Put Req. to ${resetUrl}.`

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset',
      message
    })

    res.status(200).json({ success: true, data: 'Email Sent' })
  } catch (err) {
    console.log(err)
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save({ validateBeforeSave: false })

    return next(new ErrorResponse('Email could not be sent'), 500)
  }

  res.status(200).json({ success: true, data: user })
})

export const resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex')

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  })

  if (!user) {
    return next(new ErrorResponse('Invalid Token', 400))
  }

  // Set new password
  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined

  await user.save()

  sendTokenResponse(user, 200, res)
})

export const updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    email: req.body.email
  }

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  })

  res.status(200).json({ success: true, data: user })
})

export const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password')

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect'), 401)
  }

  user.password = req.body.newPassword
  await user.save()

  sendTokenResponse(user, 200, res)
})

// Get token from model + create cookie for response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken()

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 3600000
    ),
    httpOnly: true
  }

  if (process.env.NODE_ENV === 'production') options.secure = true

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token })
}
