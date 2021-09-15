'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('rave_payments', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      payment_id: {
        type: Sequelize.UUID,
        allowNull: true,
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
        references: {
          model: 'payments',
          key: 'id',
        },
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'KES',
      },
      amount: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false,
      },
      tx_id: {
        type: Sequelize.STRING,
      },
      tx_ref: {
        type: Sequelize.STRING,
      },
      flw_ref: {
        type: Sequelize.STRING,
      },
      order_ref: {
        type: Sequelize.STRING,
      },
      rave_ref: {
        type: Sequelize.STRING,
      },
      account_id: {
        type: Sequelize.STRING,
      },
      account_name: {
        type: Sequelize.STRING,
      },
      rave_payment_id: {
        type: Sequelize.STRING,
      },
      payment_type: {
        type: Sequelize.STRING,
      },
      customer_name: {
        type: Sequelize.STRING,
      },
      customer_email: {
        type: Sequelize.STRING,
      },
      customer_phone: {
        type: Sequelize.STRING,
      },
      created: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
      },
      card_type: {
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('rave_payments');
  },
};
