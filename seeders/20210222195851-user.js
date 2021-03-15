const bcrypt = require('bcrypt')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hash = await bcrypt.hash('123', 10)
    return queryInterface.bulkInsert('Users', [
      {
        username: 'alice',
        password: hash,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'bob',
        password: hash,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'charlie',
        password: hash,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
