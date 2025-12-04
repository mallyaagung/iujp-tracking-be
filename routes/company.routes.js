const express = require("express");
const auth = require("../middleware/auth.middleware");
const CompanyController = require("../controllers/company.controller");
const router = express.Router();
const XLSX = require("xlsx");
const path = require("path");
const { companies } = require("../models");

router.get("/options", auth, CompanyController.getOptions);
// router.get("/import", async (req, res) => {
//   try {
//     const filePath = "./file/Data IUP.xlsx";

//     // Read Excel file
//     const workbook = XLSX.readFile(filePath);
//     const sheet = workbook.Sheets[workbook.SheetNames[0]];
//     const rows = XLSX.utils.sheet_to_json(sheet);

//     if (!rows.length) {
//       return res.status(400).json({ message: "Excel file is empty" });
//     }

//     // Reformat rows for DB
//     const dataToInsert = rows.map((row) => ({
//       name: row.Perusahaan || null,
//     }));

//     // Filter out empty names
//     const finalData = dataToInsert.filter((r) => r.name);

//     // Bulk Insert
//     await companies.bulkCreate(finalData, {
//       ignoreDuplicates: true, // avoids errors if duplicate names exist
//     });

//     return res.json({
//       message: "Companies imported successfully",
//       totalImported: finalData.length,
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: err.message });
//   }
// });

module.exports = router;
