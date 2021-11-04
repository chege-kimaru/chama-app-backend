'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('loan_products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false,
      },
      interest_rate: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false,
      },
      repayment_period: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      fine: {
        type: Sequelize.DECIMAL(20, 2),
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('loan_products');
  },
};
