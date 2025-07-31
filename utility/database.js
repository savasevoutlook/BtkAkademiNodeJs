const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('node-app', 'root', '*Q1w2e3r4t5*', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;
