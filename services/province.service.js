const { provinces } = require("../models");

const ProvinceService = {
  options: async () => {
    const data = await provinces.findAll();

    return data;
  },
};

module.exports = ProvinceService;
