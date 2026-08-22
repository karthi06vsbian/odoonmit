const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

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
          rejectUnauthorized: false
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
      process.env.DB_NAME || 'defaultdb',
      process.env.DB_USER || 'avnadmin',
      process.env.DB_PASS,
      {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10) || 3306,
        dialect: 'mysql',
        logging: false,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false
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
  // Local/Fallback SQLite
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
    console.error('Unable to connect to the database:', error.message);
    throw error;
  }
};

module.exports = { sequelize, connectDB };
