'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class savings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  savings.init({
    group_id: DataTypes.UUID,
    user_id: DataTypes.UUID,
    amount: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'savings',
    underscored: true,
  });
  return savings;
};