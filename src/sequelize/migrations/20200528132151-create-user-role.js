'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'user_roles',
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
        role_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          onDelete: 'RESTRICT',
          onUpdate: 'RESTRICT',
          references: {
            model: 'roles',
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
      },
      {
        uniqueKeys: {
          unique_user_id_role_id: {
            fields: ['user_id', 'role_id'],
          },
        },
      },
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user_roles');
  },
};
