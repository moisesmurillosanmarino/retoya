import { Router } from 'express'
import { matchesController } from '../controllers/matches.controller.js'

const router = Router()

router.get('/', matchesController.getAll)
router.post('/', matchesController.create)
router.get('/:id', matchesController.getById)

export default router
