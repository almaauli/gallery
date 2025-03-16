const { Sequelize } = require('sequelize');

// Buat koneksi ke database
const sequelize = new Sequelize('gallery_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;