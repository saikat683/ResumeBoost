// // const multer = require("multer");
// // const path = require("path");

// // // Store files in /uploads directory
// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => cb(null, "uploads/"),
// //   filename: (req, file, cb) => {
// //     const uniqueName = Date.now() + "-" + file.originalname;
// //     cb(null, uniqueName);
// //   },
// // });

// // // Only accept PDFs
// // const fileFilter = (req, file, cb) => {
// //   const allowedTypes = /pdf/;
// //   const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
// //   if (ext) cb(null, true);
// //   else cb(new Error("Only PDF files are allowed"));
// // };

// // const upload = multer({ storage, fileFilter });
// // module.exports = upload;
// const multer = require("multer");
// const path = require("path");

// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => {
// //     cb(null, "uploads/"); // ✅ must match your error path
// //   },
// //   filename: (req, file, cb) => {
// //     const uniqueSuffix = Date.now() + "-" + file.originalname.replace(/\s/g, "");
// //     cb(null, uniqueSuffix);
// //   },
// // });
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// module.exports = upload;



const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDFs allowed"), false);
  }
});

module.exports = upload;
