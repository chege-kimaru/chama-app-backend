'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'group_members',
      {
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
        group_id: {
          type: Sequelize.UUID,
          allowNull: false,
          onDelete: 'RESTRICT',
          onUpdate: 'RESTRICT',
          references: {
            model: 'groups',
            key: 'id',
          },
        },
        verified: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      },
      {
        uniqueKeys: {
          unique_user_id_group_id: {
            fields: ['user_id', 'group_id'],
          },
        },
      },
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('group_members');
  },
};
