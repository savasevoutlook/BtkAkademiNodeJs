const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('nodejsappdb', 'root', '*Q1w2e3r4t5*', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;
