const multer = require("multer");

const upload = multer({
  dest: "uploads/", // Directory for uploaded files
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/msword",
      "text/plain",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/xml",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type. Only specific file types are allowed."));
    }

    cb(null, true); // Accept the file
  },
});

module.exports = upload;