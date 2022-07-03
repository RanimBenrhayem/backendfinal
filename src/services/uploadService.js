const crypto = require("crypto");
const path = require("path");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

// Storage
const storage = new GridFsStorage({  //construction d'un objet
  url: process.env.database_uri,

  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {  //construction du nom unique du fichier
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname); //+extension file .csv

        const userId = req.infos.authId;

        const fileInfo = {
          filename: filename,
          metadata: { // metadata proprièté de gfs 
            originalFileName: file.originalname,
            userId,
          },
          bucketName: "uploads",  //nom de la table
        };
        resolve(fileInfo); //to the front
      });
    });
  },
});

const upload = multer({ //celui qui fait upload
  storage,
});

module.exports = upload;
