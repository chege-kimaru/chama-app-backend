'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class group_members extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  group_members.init({
    group_id: DataTypes.UUID,
    user_id: DataTypes.UUID,
    verified: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'group_members',
    underscored: true,
  });
  return group_members;
};