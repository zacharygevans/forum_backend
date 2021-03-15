'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Topics', [
      {
        title: 'Python',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Javascript',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Java',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Topics', null, {});
  }
};
