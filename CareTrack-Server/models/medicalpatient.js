'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MedicalPatient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MedicalPatient.belongsTo(models.Patient, {
        foreignKey: 'patientId'
      });
      MedicalPatient.belongsToMany(models.Medicine, {
        through: models.MedicalMedicine,
        foreignKey: 'medicalPatientId'
      });
      MedicalPatient.belongsToMany(models.Treatment, {
        through: models.MedicalTreatment,
        foreignKey: 'medicalPatientId'
      });
    }
  }
  MedicalPatient.init({
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: `Patient is required!`
        },
        notNull: {
          msg: `Patient is required!`
        }
      }
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: `Treatment Date is required!`
        },
        notNull: {
          msg: `Treatment Date is required!`
        },
        isDate: { 
          msg: 'Must be a valid date' 
        }
      }
    },
    totalCost: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: `Total Cost is required!`
        },
        notNull: {
          msg: `Total Cost is required!`
        },
        min: { 
          args: [0], 
          msg: 'Total cost must be greater than or equal to 0' 
        }
      }
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'MedicalPatient',
  });
  return MedicalPatient;
};