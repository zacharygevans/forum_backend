'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Questions', [
      {
        title: 'How do I type?',
        userId: 1,
        topicId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'How do I print?',
        userId: 1,
        topicId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'How do I define a function?',
        userId: 2,
        topicId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Questions', null, {});
  }
};
