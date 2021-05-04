'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      return queryInterface.bulkInsert('Answers', [
        {
          text: 'With a keyboard',
          userId: 2,
          questionId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          text: 'Faceroll',
          userId: 3,
          questionId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ], {});
    } catch (e) {
      console.log(e)
    }
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Answers', null, {});
  }
};
