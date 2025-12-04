const express = require("express");
const auth = require("../middleware/auth.middleware");
const ProvinceController = require("../controllers/province.controller");
const router = express.Router();

router.get("/options", auth, ProvinceController.getOptions);

module.exports = router;
