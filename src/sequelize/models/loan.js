'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class loan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  loan.init({
    group_id: DataTypes.UUID,
    user_id: DataTypes.UUID,
    loan_product_id: DataTypes.UUID,
    amount: DataTypes.NUMBER,
    payment_id: DataTypes.UUID,
    deadline: DataTypes.DATE,
    interest_rate: DataTypes.DECIMAL,
    amount_paid: DataTypes.DECIMAL,
    amount_to_be_paid: DataTypes.NUMBER,
    payment_complete: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'loan',
    underscored: true,
  });
  return loan;
};