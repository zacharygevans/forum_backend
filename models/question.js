'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Question.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      })
      Question.belongsTo(models.Topic, {
        foreignKey: 'topicId',
        onDelete: 'CASCADE'
      })
      Question.hasMany(models.Answer, { foreignKey: 'questionId' })
    }
  };
  Question.init({
    title: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    topicId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Question',
  });
  return Question;
};