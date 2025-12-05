const { verifyToken } = require("../utils/jwt");

module.exports = (req, res, next) => {
  const header =
    req.headers.access_token ||
    req.headers.Access_token ||
    req.headers.authorization;

  console.log(req.headers);
  console.log(header);

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};
