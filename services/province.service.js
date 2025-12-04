const { provinces } = require("../models");

const ProvinceService = {
  options: async () => {
    const data = await provinces.findAll({
      order: [["name", "ASC"]],
    });

    return data;
  },
};

module.exports = ProvinceService;
