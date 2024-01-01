const multer = require("multer");

const storage = (path) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `uploads/${path}`);
      console.log(file , "file----")
    },
    filename: (req, file, cb) => {
      const sanitizedFileName = file.originalname.replace(/\s+/g, "_");
      const fullFileName = `${Date.now()}-${sanitizedFileName}`;
      cb(null, fullFileName);
    },
  });
};
const upload = (path) => {
  return multer({ storage: storage(path) });
};


module.exports = upload;


