'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class loan_payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  loan_payment.init({
    loan_id: DataTypes.UUID,
    amount: DataTypes.DECIMAL,
    payment_id: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'loan_payment',
    underscored: true,
  });
  return loan_payment;
};