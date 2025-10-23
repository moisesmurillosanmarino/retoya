import { Router } from 'express'
import { bookingsController } from '../controllers/bookings.controller.js'

const router = Router()

router.get('/', bookingsController.getAll)
router.post('/', bookingsController.create)

export default router
