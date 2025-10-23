import { Router } from 'express'
import authRoutes from './auth.routes.js'
import courtsRoutes from './courts.routes.js'
import bookingsRoutes from './bookings.routes.js'
import teamsRoutes from './teams.routes.js'
import matchesRoutes from './matches.routes.js'
import betsRoutes from './bets.routes.js'

const router = Router()

// Mount routes
router.use('/auth', authRoutes)
router.use('/courts', courtsRoutes)
router.use('/bookings', bookingsRoutes)
router.use('/teams', teamsRoutes)
router.use('/matches', matchesRoutes)
router.use('/bets', betsRoutes)

export default router