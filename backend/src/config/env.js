import dotenv from 'dotenv'

dotenv.config()

export const config = {
  // Server
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  dbProvider: process.env.DB_PROVIDER || 'postgres',
  
  // PostgreSQL
  pg: {
    host: process.env.PG_HOST || 'localhost',
    port: Number(process.env.PG_PORT || 5432),
    database: process.env.PG_DATABASE || 'rbjab',
    user: process.env.PG_USER || 'rbjab',
    password: process.env.PG_PASSWORD || 'rbjab'
  },
  
  // MySQL
  mysql: {
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT || 3306),
    database: process.env.MYSQL_DATABASE || 'rbjab',
    user: process.env.MYSQL_USER || 'rbjab',
    password: process.env.MYSQL_PASSWORD || 'rbjab'
  },
  
  // MongoDB
  mongo: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017',
    db: process.env.MONGO_DB || 'rbjab'
  },
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
  
  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}