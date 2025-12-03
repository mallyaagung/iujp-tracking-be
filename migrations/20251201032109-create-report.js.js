"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    `);

    await queryInterface.createTable("reports", {
      reports_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      users_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      quarter: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      site_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      permission: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      province: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      activity: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      contract_time: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      contract_value: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
      },
      contract_realization: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
      },
      investation: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
      },
      receive_nation: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
      },
      receive_country: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
      },
      expend_local: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
      },
      expend_national: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
      },
      expend_import: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
      },
      workforce_local: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      workforce_national: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      workforce_foreign_role: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      workforce_foreign_qty: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      pic: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      pic_letter_no: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      pic_letter_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("reports");
  },
};
