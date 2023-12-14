const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, res, cb) {
      cb(null, path.join(__dirname, "/uploads"));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const filename = file.originalname.split(".")[0];
      cb(null, filename + '-' + uniqueSuffix + "jpg");
    }
  });
  const upload = multer({ storage: storage });
  
module.exports = { upload };