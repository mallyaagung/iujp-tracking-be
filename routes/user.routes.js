const express = require("express");
const UserController = require("../controllers/user.controller");
const auth = require("../middleware/auth.middleware");
const generateUniqueUsername = require("../helper/generateUsername");
const router = express.Router();
const { users } = require("../models");
const XLSX = require("xlsx");
const bcrypt = require("bcrypt");

router.post("/create", auth, UserController.createUser);
// router.get("/import", async (req, res) => {
//   try {
//     const filePath = "./file/username_iujp.xlsx";

//     // Read Excel
//     const workbook = XLSX.readFile(filePath);
//     const sheet = workbook.Sheets[workbook.SheetNames[0]];
//     const rows = XLSX.utils.sheet_to_json(sheet);

//     if (!rows.length) {
//       return res.status(400).json({ message: "Excel file is empty" });
//     }

//     let exportList = [];

//     let usedUsernames = new Set();

//     const finalData = await Promise.all(
//       rows.map(async (row) => {
//         console.log(row.Username);

//         const username = await generateUniqueUsername(usedUsernames, users);

//         let password = String(Math.floor(Math.random() * 1000000)).padStart(
//           6,
//           "0"
//         );

//         const hashed = await bcrypt.hash(password, 10);

//         exportList.push({
//           username,
//           password,
//           company_name: row.Username,
//         });

//         return {
//           username,
//           password: hashed,
//           company_name: row.Username,
//           role: "USER",
//         };
//       })
//     );

//     // Insert to DB
//     await users.bulkCreate(finalData, { ignoreDuplicates: true });

//     // Create Excel for export
//     const ws = XLSX.utils.json_to_sheet(exportList);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Passwords");

//     // Convert workbook to binary buffer
//     const buffer = XLSX.write(wb, {
//       type: "buffer",
//       bookType: "xlsx",
//     });

//     // Response headers for download
//     res.setHeader(
//       "Content-Disposition",
//       "attachment; filename=exported_passwords.xlsx"
//     );
//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );

//     return res.send(buffer);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: err.message });
//   }
// });
router.get("/all", auth, UserController.getAllUser);
router.get("/:id", auth, UserController.getUserById);
router.patch("/:id", auth, UserController.updateUser);
router.delete("/:id", auth, UserController.deleteUser);

module.exports = router;
