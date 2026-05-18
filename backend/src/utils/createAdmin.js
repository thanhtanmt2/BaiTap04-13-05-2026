const bcrypt = require('bcrypt');
const User = require('../models/User');

async function createAdminAccount() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || '123456';
  const testUserEmail = process.env.TEST_USER_EMAIL || 'user@gmail.com';
  const testUserPassword = process.env.TEST_USER_PASSWORD || '123456';

  try {
    const adminExists = await User.findOne({ where: { email: adminEmail } });

    if (adminExists) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await adminExists.update({ password: hashedPassword, role: 'admin', status: 'active' });
      console.log(`✓ Cập nhật tài khoản admin: ${adminEmail}`);
    } else {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await User.create({ email: adminEmail, password: hashedPassword, role: 'admin', status: 'active' });
      console.log(`✓ Tài khoản admin đã được tạo: ${adminEmail}`);
    }

    const testUserExists = await User.findOne({ where: { email: testUserEmail } });
    if (testUserExists) {
      const hashedTestPw = await bcrypt.hash(testUserPassword, 10);
      await testUserExists.update({ password: hashedTestPw, role: 'user', status: 'active' });
      console.log(`✓ Cập nhật tài khoản user test: ${testUserEmail}`);
    } else {
      const hashedTestPw = await bcrypt.hash(testUserPassword, 10);
      await User.create({ email: testUserEmail, password: hashedTestPw, role: 'user', status: 'active' });
      console.log(`✓ Tài khoản user test đã được tạo: ${testUserEmail}`);
    }
  } catch (error) {
    console.error('✗ Lỗi khi tạo admin:', error.message);
  }
}

module.exports = createAdminAccount;
