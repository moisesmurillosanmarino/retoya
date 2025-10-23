import { Router } from 'express'
import { courtsController } from '../controllers/courts.controller.js'

const router = Router()

router.get('/', courtsController.getAll)
router.get('/:id', courtsController.getById)

export default router
