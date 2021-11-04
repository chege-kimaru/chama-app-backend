'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    return queryInterface.bulkInsert('loan_products', [
      {
        id: 1,
        name: 'Test Loan Product 1',
        amount: 1,
        interest_rate: 2,
        repayment_period: 2,
        fine: 100,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        name: 'Test Loan Product 2',
        amount: 2,
        interest_rate: 2,
        repayment_period: 2,
        fine: 200,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('loan_products', null, {});
  },
};
