const crypto = require("crypto");
const path = require("path");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

// Storage
const joinStorage = new GridFsStorage({
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

        const { idFile1, idFile2, attribut1, attribut2 } = req.body;
        //  req.info = { fileName: filename, originaleFileName: file.originalname };

        const fileInfo = {
          filename: filename,
          metadata: {
            userId,
            originalFileName: file.originalname,
            idFile1,
            idFile2,
            attribut1,
            attribut2,
          },
          bucketName: "join",
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
  storage: joinStorage,
});

module.exports = upload;
