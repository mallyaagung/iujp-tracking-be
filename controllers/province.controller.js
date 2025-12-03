const ProvinceService = require("../services/province.service");

const ProvinceController = {
  getOptions: async (req, res) => {
    try {
      const data = await ProvinceService.options();

      return res.status(201).json({
        success: true,
        message: "Success get province options",
        data,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
};

module.exports = ProvinceController;
