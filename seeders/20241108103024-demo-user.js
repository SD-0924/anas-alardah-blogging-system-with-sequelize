'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create a mock user first
    const userId = await queryInterface.bulkInsert(
      'Users',
      [
        {
          name: 'John Doe',
          email: 'johndoe@example.com',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      { returning: ['id'] } // Get the inserted ID
    );

    // Create a mock post associated with the user
    await queryInterface.bulkInsert('Posts', [
      {
        title: 'Sample Post',
        content: 'This is a sample post content.',
        userId: userId[0].id, // Assign the created user’s ID here
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    // Revert the seeding by removing the mock data in reverse order
    await queryInterface.bulkDelete('Posts', { title: 'Sample Post' }, {});
    await queryInterface.bulkDelete('Users', { email: 'johndoe@example.com' }, {});
  }
};
