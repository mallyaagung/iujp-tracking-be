const express = require("express");
const UserController = require("../controllers/user.controller");
const auth = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/create", auth, UserController.createUser);
router.get("/all", auth, UserController.getAllUser);
router.get("/:id", auth, UserController.getUserById);
router.patch("/:id", auth, UserController.updateUser);
router.delete("/:id", auth, UserController.deleteUser);

module.exports = router;
