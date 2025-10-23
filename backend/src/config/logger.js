import pino from 'pino'
import { config } from './env.js'

const isDevelopment = config.nodeEnv === 'development'

export const logger = pino({
  level: config.logLevel,
  transport: isDevelopment ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname'
    }
  } : undefined
})

export default logger