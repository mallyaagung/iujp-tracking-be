"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("reports", "contract_value_currency", {
      type: Sequelize.ENUM("Rp", "USD"),
      allowNull: true,
    });

    await queryInterface.addColumn("reports", "contract_realization_currency", {
      type: Sequelize.ENUM("Rp", "USD"),
      allowNull: true,
    });

    await queryInterface.addColumn("reports", "investation_currency", {
      type: Sequelize.ENUM("Rp", "USD"),
      allowNull: true,
    });

    await queryInterface.addColumn("reports", "receive_nation_currency", {
      type: Sequelize.ENUM("Rp", "USD"),
      allowNull: true,
    });

    await queryInterface.addColumn("reports", "receive_country_currency", {
      type: Sequelize.ENUM("Rp", "USD"),
      allowNull: true,
    });

    await queryInterface.addColumn("reports", "expend_local_currency", {
      type: Sequelize.ENUM("Rp", "USD"),
      allowNull: true,
    });

    await queryInterface.addColumn("reports", "expend_national_currency", {
      type: Sequelize.ENUM("Rp", "USD"),
      allowNull: true,
    });

    await queryInterface.addColumn("reports", "expend_import_currency", {
      type: Sequelize.ENUM("Rp", "USD"),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("reports", "contract_value_currency");
    await queryInterface.removeColumn(
      "reports",
      "contract_realization_currency"
    );
    await queryInterface.removeColumn("reports", "investation_currency");
    await queryInterface.removeColumn("reports", "receive_nation_currency");
    await queryInterface.removeColumn("reports", "receive_country_currency");
    await queryInterface.removeColumn("reports", "expend_local_currency");
    await queryInterface.removeColumn("reports", "expend_national_currency");
    await queryInterface.removeColumn("reports", "expend_import_currency");

    // Important: remove enum type from database (Postgres requirement)
    await queryInterface.sequelize.query(
      `DROP TYPE "enum_reports_contract_value_currency";`
    );
    await queryInterface.sequelize.query(
      `DROP TYPE "enum_reports_contract_realization_currency";`
    );
    await queryInterface.sequelize.query(
      `DROP TYPE "enum_reports_investation_currency";`
    );
    await queryInterface.sequelize.query(
      `DROP TYPE "enum_reports_receive_nation_currency";`
    );
    await queryInterface.sequelize.query(
      `DROP TYPE "enum_reports_receive_country_currency";`
    );
    await queryInterface.sequelize.query(
      `DROP TYPE "enum_reports_expend_local_currency";`
    );
    await queryInterface.sequelize.query(
      `DROP TYPE "enum_reports_expend_national_currency";`
    );
    await queryInterface.sequelize.query(
      `DROP TYPE "enum_reports_expend_import_currency";`
    );
  },
};
