const express = require("express");
const ReportController = require("../controllers/report.controller");
const auth = require("../middleware/auth.middleware");
const upload = require("../middleware/uploadFile");
const router = express.Router();

router.post(
  "/create",
  auth,
  (req, res, next) => {
    upload.any()(req, res, function (err) {
      if (err) {
        // This catches fileFilter errors & fileSize errors
        return res.status(400).json({ success: false, message: err.message });
      }
      next(); // continue to controller
    });
  },
  ReportController.createReport
);
router.post("/export", auth, ReportController.exportReportSubmission);
router.get("/all", auth, ReportController.getAllReport);
router.get("/dashboard", auth, ReportController.getReportSubmission);
router.get("/:id", auth, ReportController.getReportById);
router.patch("/:id", auth, ReportController.updateReport);
router.delete("/:id", auth, ReportController.deleteReport);

module.exports = router;
