'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('loan_payments', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      loan_id: {
        type: Sequelize.UUID,
        allowNull: false,
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
        references: {
          model: 'loans',
          key: 'id',
        },
      },
      amount: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      payment_id: {
        type: Sequelize.UUID,
        allowNull: false,
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
        references: {
          model: 'payments',
          key: 'id',
        },
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
    await queryInterface.dropTable('loan_payments');
  },
};
