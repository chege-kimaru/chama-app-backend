'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('payments', 'user_id', {
      type: Sequelize.UUID,
      allowNull: false,
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
      references: {
        model: 'users',
        key: 'id',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('payments', 'user_id');
  },
};
