import { Router } from 'express'
import { teamsController } from '../controllers/teams.controller.js'

const router = Router()

router.get('/', teamsController.getAll)
router.post('/', teamsController.create)
router.get('/:id', teamsController.getById)

export default router
