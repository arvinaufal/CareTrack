'use strict';
const {
  Model
} = require('sequelize');
const { bcryptHash } = require('../helpers/bcryptjs');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    name: {
        type: DataTypes.STRING,
        allowNull:false,
        validate: {
          notEmpty: {
            msg: `Name is required!`
          },
          notNull: {
            msg: `Name is required!`
          },
          len : {
            args: [1, 200],
            msg: "Max length is 200 characters!"
          }
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique : true,
      validate : {
        notNull : {
          msg : `Email is required!`
        },
        notEmpty : {
          msg : `Email is required!`
        },
        isEmail : {
          msg : `Must be an email!`
        },
        len : {
          args: [1, 200],
          msg: "Max length is 200 characters!"
        }
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique : true,
      validate : {
        notNull : {
          msg : `Username is required!`
        },
        notEmpty : {
          msg : `Username is required!`
        },
        len : {
          args: [1, 50],
          msg: "Max length is 50 characters!"
        }
      }
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Status is required`
        },
        notEmpty : {
          msg : `Status is required!`
        },
      }
    },
    accountType: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Account Type is required`
        },
        notEmpty : {
          msg : `Account Type is required!`
        },
      }
    },
    emailVerifiedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate : {
        notNull : {
          msg : `Password is required!`
        },
        notEmpty : {
          msg : `Password is required!`
        },
        len : {
          args: [5, Infinity],
          msg: "Password must be at least 5 characters!"
        }
      }
    },
  }, {
    sequelize,
    modelName: 'User',
  });

  
  User.beforeCreate((user) => {
    user.password = bcryptHash(user.password);
  });

  return User;
};