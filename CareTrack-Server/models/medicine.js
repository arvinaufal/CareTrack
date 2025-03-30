'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Medicine extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Medicine.belongsToMany(models.MedicalPatient, {
        through: models.MedicalMedicine,
        foreignKey: 'medicineId'
      });
    }
  }
  Medicine.init({
    code: {
      type: DataTypes.STRING(8),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: `Medicine code is required!`
        },
        notNull: {
          msg: `Medicine code is required!`
        },
        len: {
          args: [1, 8],
          msg: "Medicine code must be between 1 and 8 characters",
        },
      }
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: `Medicine name is required!`
        },
        notNull: {
          msg: `Medicine name is required!`
        },
        len: {
          args: [1, 200],
          msg: "Medicine name must be between 1 and 8 characters",
        },
      }
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: `Medicine price is required!`
        },
        notNull: {
          msg: `Medicine price is required!`
        },
        min: { 
          args: [0],
          msg: 'Price must be greater than or equal to 0' 
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Medicine',
  });
  return Medicine;
};