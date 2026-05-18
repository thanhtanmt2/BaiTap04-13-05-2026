require('dotenv').config();
const { Sequelize } = require('sequelize');
const createAdminAccount = require('../utils/createAdmin');
const seedProducts = require('../utils/seedProducts');

const initializeDatabase = async () => {
  try {
    const dbName = process.env.DB_NAME || 'nhom4_baitap';
    const dbUser = process.env.DB_USER || 'root';
    const dbPassword = process.env.DB_PASSWORD || '';
    const dbHost = process.env.DB_HOST || 'localhost';
    const dbPort = process.env.DB_PORT || 3306;

    // Create connection without database to execute CREATE DATABASE
    const sequelizeAdmin = new Sequelize('', dbUser, dbPassword, {
      host: dbHost,
      port: dbPort,
      dialect: 'mysql',
      logging: false,
      dialectOptions: {
        charset: 'utf8mb4',
      },
    });

    await sequelizeAdmin.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log(`✓ Database '${dbName}' được tạo hoặc đã tồn tại`);
    await sequelizeAdmin.close();

    // Now connect to the actual database
    const sequelize = require('./database');
    await sequelize.authenticate();
    console.log('✓ Kết nối database thành công');

    // Load all models so they are registered before sync
    require('../models/index');

    // Sync models without destructive changes
    await sequelize.sync({ force: false });
    console.log('✓ Database da duoc khoi tao thanh cong');

    await createAdminAccount();
    await seedProducts();
  } catch (error) {
    console.error('✗ Lỗi kết nối database:', error.message);
    process.exit(1);
  }
};

module.exports = initializeDatabase;
