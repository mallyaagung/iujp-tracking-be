const ReportService = require("../services/report.service");
const stream = require("stream");

const ReportController = {
  createReport: async (req, res) => {
    try {
      const payload = req.body;
      const files = req.files; // from multer

      const result = await ReportService.create(payload, files);

      return res.status(201).json({
        success: true,
        message: "Success create report",
      });
    } catch (err) {
      console.log("Create Report Error:", err);
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  },

  getAllReport: async (req, res) => {
    try {
      const { data, meta } = await ReportService.getAll(req.query);

      return res.status(201).json({
        success: true,
        message: "Success get all data report",
        data,
        meta,
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  getReportById: async (req, res) => {
    try {
      const newId = Buffer.from(req.params.id, "base64").toString("ascii");
      const report = await ReportService.getById(newId);

      return res.status(201).json({
        success: true,
        message: "Success get report by id",
        data: report,
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  getReportById: async (req, res) => {
    try {
      const newId = Buffer.from(req.params.id, "base64").toString("ascii");
      console.log(newId);

      const report = await ReportService.getById(newId);

      return res.status(201).json({
        success: true,
        message: "Success get report by id",
        data: report,
      });
    } catch (error) {
      console.log(error);

      return res.status(400).json({ success: false, message: error.message });
    }
  },

  getReportSubmission: async (req, res) => {
    try {
      const report = await ReportService.getReportSubmissionStats(req.query);

      return res.status(200).send({
        success: true,
        message: "Success get report by id",
        data: report,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ success: false, message: error.message });
    }
  },

  exportReportSubmission: async (req, res) => {
    try {
      const { year, quarter } = req.query;
      const report = await ReportService.exportReport(req.body, year, quarter);
      const fileBuffer = await report.writeToBuffer();

      const readStream = new stream.PassThrough();
      readStream.end(fileBuffer);

      res.set({
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=Export_Report.xlsx",
      });

      readStream.pipe(res);
    } catch (error) {
      console.log(error);

      return res.status(400).json({ success: false, message: error.message });
    }
  },

  updateReport: async (req, res) => {
    try {
      const newId = Buffer.from(req.params.id, "base64").toString("ascii");

      const report = await ReportService.update(newId, req.body);

      return res.status(201).json({
        success: true,
        message: "Success update data report",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  deleteReport: async (req, res) => {
    try {
      const newId = Buffer.from(req.params.id, "base64").toString("ascii");

      const report = await ReportService.delete(newId);

      return res.status(201).json({
        success: true,
        message: "Success delete data report",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
};

module.exports = ReportController;
