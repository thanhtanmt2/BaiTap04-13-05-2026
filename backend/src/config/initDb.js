require('dotenv').config();
const { Sequelize } = require('sequelize');
const createAdminAccount = require('../utils/createAdmin');

const initializeDatabase = async () => {
  try {
    // Create connection without database to execute CREATE DATABASE
    const sequelizeAdmin = new Sequelize(
      '',
      process.env.DB_USER || 'root',
      process.env.DB_PASSWORD || '',
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false,
        dialectOptions: {
          charset: 'utf8mb4',
        },
      }
    );

    // Create database if not exists
    const dbName = process.env.DB_NAME || 'nhom4_baitap';
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

    // Sync models - dung alter:true de tu dong cap nhat schema khi co thay doi
    await sequelize.sync({ alter: true });
    console.log('✓ Database da duoc khoi tao thanh cong');

    // Create admin account
    await createAdminAccount();
  } catch (error) {
    console.error('✗ Lỗi kết nối database:', error.message);
    process.exit(1);
  }
};

module.exports = initializeDatabase;
