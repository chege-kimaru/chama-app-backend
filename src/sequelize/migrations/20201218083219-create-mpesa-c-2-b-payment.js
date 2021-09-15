'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('mpesa_c2b_payments', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
        references: {
          model: 'users',
          key: 'id',
        },
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
      merchant_request_id: {
        type: Sequelize.STRING,
      },
      checkout_request_id: {
        type: Sequelize.STRING,
      },
      result_code: {
        type: Sequelize.STRING,
      },
      result_desc: {
        type: Sequelize.STRING,
      },
      amount: {
        type: Sequelize.DECIMAL(20, 2),
      },
      mpesa_receipt_number: {
        type: Sequelize.STRING,
      },
      balance: {
        type: Sequelize.DECIMAL(20, 2),
      },
      transaction_date: {
        type: Sequelize.STRING,
      },
      phone_number: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('mpesa_c2b_payments');
  },
};
