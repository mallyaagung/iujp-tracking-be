const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["application/pdf"];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Hanya bisa upload file PDF"), false);
    }

    cb(null, true);
  },
});

module.exports = upload;
