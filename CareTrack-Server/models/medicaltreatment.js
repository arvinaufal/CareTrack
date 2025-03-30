'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MedicalTreatment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MedicalTreatment.belongsTo(models.Treatment, {
        foreignKey: 'treatmentId'
      });
      MedicalTreatment.belongsTo(models.MedicalPatient, {
        foreignKey: 'medicalPatientId'
      });
    }
  }
  MedicalTreatment.init({
    treatmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: `Treatment is required!`
        },
        notNull: {
          msg: `Treatment is required!`
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
          msg: `Treatment Quantity is required!`
        },
        notNull: {
          msg: `Treatment Quantity is required!`
        },
        min: {
          args: 1,
          msg: `Minimal treatment quantity is 1`
        }
      }
    },
  }, {
    sequelize,
    modelName: 'MedicalTreatment',
  });
  return MedicalTreatment;
};