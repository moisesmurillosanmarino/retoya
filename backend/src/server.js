import { config } from './config/env.js'
import { logger } from './config/logger.js'
import app from './app.js'

const PORT = config.port

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`)
  logger.info(`📚 API Documentation: http://localhost:${PORT}/api/docs`)
  logger.info(`🏥 Health Check: http://localhost:${PORT}/health`)
  logger.info(`🌍 Environment: ${config.nodeEnv}`)
  logger.info(`🗄️ Database Provider: ${config.dbProvider}`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully')
  server.close(() => {
    logger.info('Process terminated')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully')
  server.close(() => {
    logger.info('Process terminated')
    process.exit(0)
  })
})