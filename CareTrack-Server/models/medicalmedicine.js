'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MedicalMedicine extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MedicalMedicine.belongsTo(models.Medicine, {
        foreignKey: 'medicineId'
      });
      MedicalMedicine.belongsTo(models.MedicalPatient, {
        foreignKey: 'medicalPatientId'
      });
    }
  }
  MedicalMedicine.init({
    medicineId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: `Medicine is required!`
        },
        notNull: {
          msg: `Medicine is required!`
        }
      }
    },
    medicalPatientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: `Medical patient is required!`
        },
        notNull: {
          msg: `Medical patient is required!`
        }
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: `Medicine quantity is required!`
        },
        notNull: {
          msg: `Medicine quantity is required!`
        },
        min: {
          args: 1,
          msg: `Minimal medicine quantity is 1`
        }
      }
    },
  }, {
    sequelize,
    modelName: 'MedicalMedicine',
  });
  return MedicalMedicine;
};