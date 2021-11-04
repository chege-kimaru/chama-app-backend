'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class loan_product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  loan_product.init({
    name: DataTypes.STRING,
    amount: DataTypes.DECIMAL,
    interest_rate: DataTypes.DECIMAL,
    repayment_period: DataTypes.NUMBER,
    fine: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'loan_product',
    underscored: true,
  });
  return loan_product;
};