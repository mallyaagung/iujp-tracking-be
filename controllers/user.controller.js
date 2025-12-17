const UserService = require("../services/user.service");

const UserController = {
  createUser: async (req, res) => {
    try {
      const user = await UserService.create(req.body);
      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user,
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  getAllUser: async (req, res) => {
    try {
      const { data, meta } = await UserService.getAll(req.query);

      return res.status(201).json({
        success: true,
        message: "Success get all data user",
        data,
        meta,
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  getUserById: async (req, res) => {
    try {
      const newId = Buffer.from(req.params.id, "base64").toString("ascii");
      const user = await UserService.getById(newId);

      return res.status(201).json({
        success: true,
        message: "Success get user by id",
        data: user,
      });
    } catch (error) {
      console.log(error);

      return res.status(400).json({ success: false, message: error.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      const newId = Buffer.from(req.params.id, "base64").toString("ascii");

      const user = await UserService.update(newId, req.body);

      return res.status(201).json({
        success: true,
        message: "Success update data user",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const newId = Buffer.from(req.params.id, "base64").toString("ascii");

      const user = await UserService.delete(newId);

      return res.status(201).json({
        success: true,
        message: "Success delete user data",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
};

module.exports = UserController;
