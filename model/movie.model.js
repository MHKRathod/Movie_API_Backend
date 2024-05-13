const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // Assuming you have a db configuration file
const Genre = require('./genre.model');
const Actor = require('./actor.model');
const Technician = require('./technician.model');

class Movie extends Model {}

Movie.init({
  // Define attributes of the Movie model
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  releaseYear: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ratings: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  director: {
    type: DataTypes.STRING,
    allowNull: true // Assuming a movie may not have a director specified
  }
}, {
  sequelize, // We need to pass the connection instance
  timestamps: false,
  modelName: 'Movie' // We choose the model name
});

Movie.belongsToMany(Genre, { through: 'MovieGenre', timestamps: false });
Movie.belongsToMany(Actor, { through: 'MovieActor', timestamps: false });
Movie.belongsToMany(Technician, { through: 'MovieTechnician', timestamps: false });

module.exports = Movie;





