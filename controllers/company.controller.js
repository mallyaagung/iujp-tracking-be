const CompanyService = require("../services/company.service");

const CompanyController = {
  getOptions: async (req, res) => {
    try {
      const data = await CompanyService.options();

      return res.status(201).json({
        success: true,
        message: "Success get company options",
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

module.exports = CompanyController;
