const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // Assuming you have a db configuration file

class Technician extends Model {}

Technician.init({
  // Define attributes of the Technician model
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize, // We need to pass the connection instance
  timestamps: false,
  modelName: 'Technician' // We choose the model name
});

module.exports = Technician;
