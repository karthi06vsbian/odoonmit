const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

const rawUri = process.env.DB_URI || process.env.DATABASE_URL;
const dbUri = rawUri ? rawUri.split('?')[0] : null;

if (dbUri || process.env.DB_DIALECT === 'mysql') {
  if (dbUri) {
    sequelize = new Sequelize(dbUri, {
      dialect: 'mysql',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false // Bypasses self-signed certificate validation for easy Aiven connection
        }
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });
  } else {
    sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASS,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false // Bypasses self-signed certificate validation for easy Aiven connection
          }
        },
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      }
    );
  }
} else {
  // Fallback/Default to SQLite (handles writable /tmp directory on Vercel serverless)
  const isVercel = !!process.env.VERCEL;
  const sqliteStorage = process.env.DB_STORAGE || (isVercel ? '/tmp/dayflow.sqlite' : './dayflow.sqlite');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: sqliteStorage,
    logging: false
  });
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`Database connected successfully using ${sequelize.getDialect()} dialect.`);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
