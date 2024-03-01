// const multer = require("multer");

// const storage = (path) => {
//   console.log("path4",path)
//   return multer.diskStorage({
    
//     destination: (req, file, cb) => {
//       console.log(file , "file----")
//       cb(null, `uploads/${path}`);
//       console.log(file , "file----")
//     },
//     filename: (req, file, cb) => {
//       const sanitizedFileName = file.originalname.replace(/\s+/g, "_");
//       const fullFileName = `${Date.now()}-${sanitizedFileName}`;
//       cb(null, fullFileName);
//     },
//   });
// };
// const upload = (path) => {
//   return multer({ storage: storage(path) });
// };


// module.exports = upload;


const multer = require("multer");

const storage = (path) => {
  console.log("path4", path);
  return multer.diskStorage({
    destination: (req, file, cb) => {
      console.log("Destination path:", path);
      console.log("Uploaded file:", file);
      cb(null, `uploads/${path}`);
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
