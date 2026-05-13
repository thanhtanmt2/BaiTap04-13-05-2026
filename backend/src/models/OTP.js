const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OTP = sequelize.define(
  'OTP',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // Khoa ngoai lien ket voi bang users
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    // Ma OTP 6 chu so
    code: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },
    // Thoi gian het han cua OTP
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    // Danh dau OTP da duoc su dung chua
    is_used: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'otps',
    timestamps: false,
  }
);

module.exports = OTP;
