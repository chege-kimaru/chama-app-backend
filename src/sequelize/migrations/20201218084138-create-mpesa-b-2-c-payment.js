/* eslint-disable @typescript-eslint/camelcase */
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('mpesa_b2c_payments', {
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
      result_code: {
        type: Sequelize.STRING,
      },
      result_desc: {
        type: Sequelize.STRING,
      },
      originator_conversation_id: {
        type: Sequelize.STRING,
      },
      conversation_id: {
        type: Sequelize.STRING,
      },
      transaction_id: {
        type: Sequelize.STRING,
      },
      transaction_amount: {
        type: Sequelize.DECIMAL(20, 2),
      },
      transaction_receipt: {
        type: Sequelize.STRING,
      },
      b2c_recipient_is_registered_customer: {
        type: Sequelize.STRING,
      },
      b2c_charges_paid_account_available_funds: {
        type: Sequelize.DECIMAL(20, 2),
      },
      receiver_party_public_name: {
        type: Sequelize.STRING,
      },
      transaction_completed_date_time: {
        type: Sequelize.STRING,
      },
      b2c_utility_account_available_funds: {
        type: Sequelize.DECIMAL(20, 2),
      },
      b2c_working_account_available_funds: {
        type: Sequelize.DECIMAL(20, 2),
      },
      response_code: {
        type: Sequelize.STRING,
      },
      result_type: {
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
    await queryInterface.dropTable('mpesa_b2c_payments');
  },
};
