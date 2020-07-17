if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

module.exports = {
  type: 'mariadb',
  host: process.env.TYPEORM_HOST,
  port: Number.parseInt(process.env.TYPEORM_PORT),
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  migrationsTableName: 'migrations',
  migrations: ['dist/server/migrations/*.js'],
  cli: {
    migrationsDir: 'server/migrations',
  },
};
