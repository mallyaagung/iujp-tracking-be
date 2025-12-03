const AuthService = require("../services/auth.service");

const AuthController = {
  login: async (req, res) => {
    try {
      const { user, token } = await AuthService.login(req.body);
      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: { user, token },
      });
    } catch (err) {
      console.log(err);

      return res.status(400).json({ success: false, message: err.message });
    }
  },
};

module.exports = AuthController;
