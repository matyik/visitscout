import mongoose from 'mongoose'

const WebsiteSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: [true, 'Please add a name'],
    maxlength: [50, 'Maximum name length is 50']
  },
  visits: { type: Number, default: 0 },
  browsers: {
    firefox: { type: Number, default: 0 },
    chrome: { type: Number, default: 0 },
    edge: { type: Number, default: 0 },
    safari: { type: Number, default: 0 }
  },
  os: {
    ios: { type: Number, default: 0 },
    windows: { type: Number, default: 0 },
    mac: { type: Number, default: 0 },
    linux: { type: Number, default: 0 },
    android: { type: Number, default: 0 }
  },
  mobile: { type: Number, default: 0 },
  probablyBot: { type: Number, default: 0 },
  timeZones: {
    type: Object,
    default: {}
  },
  pages: {
    type: Object,
    default: {}
  },
  months: {
    type: Object,
    default: {}
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Website', WebsiteSchema)
