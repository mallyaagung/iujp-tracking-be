const { users } = require("../models");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");

const AuthService = {
  login: async ({ username, password }) => {
    const user = await users.findOne({ where: { username } });
    if (!user) throw new Error("Username salah");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Password salah");

    const token = generateToken({
      users_id: user.users_id,
      username: user.username,
    });

    return { user, token };
  },
};

module.exports = AuthService;
