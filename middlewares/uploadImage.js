// const multer = require('multer');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// const upload = multer({ storage: storage });
// module.exports=upload

const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const sanitizedFileName = file.originalname.replace(/\s+/g, '_');
    const fullFileName = `${Date.now()}-${sanitizedFileName}`;
    cb(null, fullFileName);
  }
});
const upload = multer({ storage: storage });

module.exports = upload;
