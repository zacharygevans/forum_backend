'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Questions', 'topicId', {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Topics',
        key: 'id',
        as: 'topicId',
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Questions', 'topicId')
  }
};
