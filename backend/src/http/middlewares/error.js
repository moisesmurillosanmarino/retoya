import { logger } from '../../config/logger.js'

export const errorHandler = (err, req, res, next) => {
  logger.error({
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  })

  // Default error
  let status = 500
  let message = 'Internal Server Error'

  // Handle specific error types
  if (err.name === 'ValidationError') {
    status = 400
    message = err.message
  } else if (err.name === 'UnauthorizedError') {
    status = 401
    message = 'Unauthorized'
  } else if (err.name === 'ForbiddenError') {
    status = 403
    message = 'Forbidden'
  } else if (err.name === 'NotFoundError') {
    status = 404
    message = 'Not Found'
  } else if (err.status) {
    status = err.status
    message = err.message
  }

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}
