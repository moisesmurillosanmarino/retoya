import 'dotenv/config'

const common = {
  migrations: { 
    tableName: 'knex_migrations', 
    extension: 'js', 
    directory: './src/infra/db/knex/migrations' 
  },
  seeds: { 
    directory: './src/infra/db/knex/seeds' 
  }
}

const pg = {
  client: 'pg',
  connection: {
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT || 5432),
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    ...(process.env.PG_PASSWORD && { password: process.env.PG_PASSWORD })
  },
  ...common
}

const mysql = {
  client: 'mysql2',
  connection: {
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT || 3306),
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
  },
  ...common
}

const sqlite = {
  client: 'sqlite3',
  connection: {
    filename: './database.sqlite'
  },
  useNullAsDefault: true,
  ...common
}

export default (() => {
  switch (process.env.DB_PROVIDER) {
    case 'mysql':
      return mysql
    case 'sqlite':
      return sqlite
    default:
      return pg
  }
})()