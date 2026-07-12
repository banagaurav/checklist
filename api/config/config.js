require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    dialect: 'postgres',
    port: process.env.DATABASE_PORT || 5432,
    logging: true,
    dialectOptions: {
      ssl:
        process.env.DATABASE_USE_SSL === 'true'
          ? {
              require: true,
              rejectUnauthorized: false,
            }
          : false,
    },
  },
  production: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    dialect: 'postgres',
    port: process.env.DATABASE_PORT || 5432,
    logging: false,
    dialectOptions: {
      ssl:
        process.env.DATABASE_USE_SSL === 'true'
          ? {
              require: true, // Ensure SSL is used (only if needed)
              rejectUnauthorized: false, // Allow self-signed certificates
            }
          : false, // Disable SSL if not needed
    },
  },
};
