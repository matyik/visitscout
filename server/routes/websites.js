import express from 'express'

import {
  getWebsite,
  addWebsite,
  editWebsite,
  deleteWebsite,
  addVisit
} from '../controllers/websites.js'

import { protect } from '../middleware/auth.js'

const router = express.Router()

router.route('/').post(protect, addWebsite)

router
  .route('/:id')
  .get(getWebsite)
  .put(protect, editWebsite)
  .delete(protect, deleteWebsite)

router.route('/:id/visit').post(addVisit)

export default router
