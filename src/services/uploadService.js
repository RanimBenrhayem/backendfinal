const crypto = require("crypto");
const path = require("path");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

// Storage
const storage = new GridFsStorage({
  url: process.env.database_uri,

  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        //const bucketName = req.body.bucketName ;
        // console.log("id*****************",req.body.idFile1)
        const userId = req.infos.authId;

        //req.info = { fileName: filename, originaleFileName: file.originalname };

        const fileInfo = {
          filename: filename,
          metadata: {
            originalFileName: file.originalname,
            userId,
          },
          bucketName: "uploads",
        };
        // const fileInfo = {
        //   filename: filename,
        //    metadata,
        //   bucketName : "uploads",
        // };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({
  storage,
});

module.exports = upload;
