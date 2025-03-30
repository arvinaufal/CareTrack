'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Patient.hasMany(models.MedicalPatient, {
        foreignKey: 'patientId'
      });
    }
  }
  Patient.init({
    codeId: {
      type: DataTypes.STRING(8),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: `Patient code/Patient ID is required!`
        },
        notNull: {
          msg: `Patient code/Patient ID is required!`
        },
        len: {
          args: [1, 8],
          msg: "Patient code must be between 1 and 8 characters",
        },
      }
    },
    email: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: `Patient Email is required!`
        },
        notNull: {
          msg: `Patient Email is required!`
        },
        len: {
          args: [1, 200],
          msg: "Patient email must be between 1 and 200 characters",
        },
      }
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: `Patient name is required!`
        },
        notNull: {
          msg: `Patient name is required!`
        },
        len: {
          args: [1, 200],
          msg: "Patient name must be between 1 and 200 characters",
        },
      }
    },
    birthDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: `Patient Birthdate is required!`
        },
        notNull: {
          msg: `Patient Birthdate is required!`
        },
        isDate: { 
          msg: 'Must be a valid date' 
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Patient',
  });
  return Patient;
};