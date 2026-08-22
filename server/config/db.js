const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.DB_DIALECT === 'mysql') {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      dialect: 'mysql',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
} else {
  // Fallback/Default to SQLite
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || './dayflow.sqlite',
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
