import Website from '../models/Website.js'
import ErrorResponse from '../utils/errorResponse.js'
import asyncHandler from '../middleware/async.js'

export const getWebsite = asyncHandler(async (req, res, next) => {
  const website = await Website.findById(req.params.id)

  if (!website)
    return next(
      new ErrorResponse(`Website not found with an ID of ${req.params.id}`, 404)
    )

  res.status(200).json({ success: true, data: website })
})

export const addWebsite = asyncHandler(async (req, res, next) => {
  // Add user
  req.body.user = req.user.id

  const website = await Website.create(req.body)

  res.status(201).json({ success: true, data: website })
})

export const editWebsite = asyncHandler(async (req, res, next) => {
  let website = await Website.findById(req.params.id)

  if (!website)
    return next(
      new ErrorResponse(`Website not found with an ID of ${req.params.id}`, 404)
    )

  // Make sure user is website owner
  if (website.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to edit this website`
      ),
      401
    )
  }

  website = await Website.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  res.status(200).json({ success: true, data: website })
})

export const deleteWebsite = asyncHandler(async (req, res, next) => {
  const website = await Website.findById(req.params.id)

  if (!website)
    return next(
      new ErrorResponse(`Website not found with an ID of ${req.params.id}`, 404)
    )

  // Make sure user is website owner
  if (website.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to edit this website`
      ),
      401
    )
  }

  await Website.findByIdAndDelete(req.params.id)

  res.status(200).json({ success: true, data: {} })
})

export const addVisit = asyncHandler(async (req, res, next) => {
  let website = await Website.findById(req.params.id)

  if (!website)
    return next(
      new ErrorResponse(`Website not found with an ID of ${req.params.id}`, 404)
    )

  const BROWSERS = ['Edg', 'Chrome', 'Firefox', 'Safari']
  const OS = ['iPhone OS', 'Windows', 'Mac', 'Android', 'Blackberry', 'Linux']

  const userAgent = req.body.userAgent

  let info = {
    page: req.body.page,
    browser: '',
    os: '',
    timeZone: req.body.timeZone / 60,
    probablyBot: true,
    mobile: false
  }

  BROWSERS.forEach((browser) => {
    if (info.browser === '' && userAgent.indexOf(browser) !== -1) {
      info.browser = browser
    }
  })

  OS.forEach((os) => {
    if (info.os === '' && userAgent.indexOf(os) !== -1) {
      info.os = os
    }
  })

  if (info.browser !== '' && info.os !== '') {
    info.probablyBot = false
  }

  if (
    info.os === 'iPhone OS' ||
    info.os === 'Android' ||
    info.os === 'Blackberry'
  ) {
    info.mobile = true
  }

  if (info.probablyBot) {
    website.probablyBot++
  } else {
    website.visits++
    if (info.os === 'Windows') {
      website.os.windows++
    } else if (info.os === 'Android') {
      website.os.android++
    } else if (info.os === 'iPhone OS') {
      website.os.ios++
    } else if (info.os === 'Mac') {
      website.os.mac++
    } else if (info.os === 'Linux') {
      website.os.linux++
    }

    if (info.browser === 'Edg') {
      website.browsers.edge++
    } else if (info.browser === 'Chrome') {
      website.browsers.chrome++
    } else if (info.browser === 'Safari') {
      website.browsers.safari++
    } else if (info.browser === 'Firefox') {
      website.browsers.firefox++
    }

    if (info.mobile) {
      website.mobile++
    }

    if (`t${info.timeZone}` in website.timeZones) {
      website.timeZones[`t${info.timeZone}`]++
    } else {
      website.timeZones[`t${info.timeZone}`] = 1
    }

    if (info.page in website.pages) {
      website.pages[info.page]++
    } else {
      website.pages[info.page] = 1
    }

    const d = new Date()
    const y = d.getFullYear()
    const m = d.getMonth()

    if (`m${y}-${m}` in website.months) {
      website.months[`m${y}-${m}`]++
    } else {
      website.months[`m${y}-${m}`] = 1
    }
  }

  website = await Website.findByIdAndUpdate(req.params.id, website, {
    new: true,
    runValidators: true
  })

  res.status(200).json({ success: true, data: info })
})
