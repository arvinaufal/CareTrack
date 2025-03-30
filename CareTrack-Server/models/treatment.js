'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Treatment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Treatment.belongsToMany(models.MedicalPatient, {
        through: models.MedicalTreatment,
        foreignKey: 'treatmentId'
      });
    }
  }
  Treatment.init({
    code: {
      type: DataTypes.STRING(8),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: `Treatment code is required!`
        },
        notNull: {
          msg: `Treatment code is required!`
        },
        len: {
          args: [1, 8],
          msg: "Treatment code must be between 1 and 8 characters",
        },
      }
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: `Treatment name is required!`
        },
        notNull: {
          msg: `Treatment name is required!`
        },
        len: {
          args: [1, 200],
          msg: "Treatment name must be between 1 and 8 characters",
        },
      }
    },
    cost: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: `Treatment cost is required!`
        },
        notNull: {
          msg: `Treatment cost is required!`
        },
        min: { 
          args: [0],
          msg: 'Cost must be greater than or equal to 0' 
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Treatment',
  });
  return Treatment;
};