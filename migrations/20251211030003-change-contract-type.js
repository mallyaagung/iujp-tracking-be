"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE reports
      ALTER COLUMN contract_time TYPE TIMESTAMPTZ
      USING contract_time::timestamp;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE reports
      ALTER COLUMN contract_time TYPE VARCHAR;
    `);
  },
};
