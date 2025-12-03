"use strict";
const bcrypt = require("bcrypt");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashed = await bcrypt.hash("admin", 10);
    return queryInterface.bulkInsert("users", [
      {
        username: "admin",
        password: hashed,
        role: "ADMIN",
        company_name: "ADMIN",
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", null, {});
  },
};
