import { Router } from 'express'
import { betsController } from '../controllers/bets.controller.js'

const router = Router()

router.get('/', betsController.getAll)
router.post('/', betsController.create)
router.get('/:id', betsController.getById)

export default router
