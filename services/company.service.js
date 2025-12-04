const { companies } = require("../models");

const CompanyService = {
  options: async () => {
    const data = await companies.findAll({
      order: [["name", "ASC"]],
    });

    return data;
  },
};

module.exports = CompanyService;
