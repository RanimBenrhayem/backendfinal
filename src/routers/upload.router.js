const express = require("express");
const uploadController = require("../controllers/upload.controller");
const upload = require("../services/uploadService");
const uploadjoin = require("../services/joinUploadService");

const join = require("../services/join");
const joinedFilesController = require("../controllers/joinedFiles.controller");
const adminGuard = require("../guards/admin.guard");
const jwtHandling = require("../services/jwt");
const userGuard = require("../guards/user.guard");
const router = express.Router();

router.post(
  "",
  [jwtHandling.jwtVerify, userGuard, upload.single("file")],
  uploadController.uploadProcess
); //upload files
router.post(
  "/join/add/:userId",
  [jwtHandling.jwtVerify, userGuard, uploadjoin.single("file")],
  uploadController.uploadProcess
);
router.get(
  "/:filename",
  [jwtHandling.jwtVerify, userGuard],
  uploadController.getFileByFileName
); //file table
router.delete(
  "/files/delete/:id/:userId?",
  [jwtHandling.jwtVerify, userGuard],
  uploadController.deleteFileFromDB
); //delete
router.post(
  "/join/files",
  [jwtHandling.jwtVerify, userGuard],
  joinedFilesController.joinProcess
);
router.get(
  "/filesbyid/:id",
  [jwtHandling.jwtVerify, userGuard],
  uploadController.getFileById
);
router.get(
  "/file/join/allbyid/:id",
  [jwtHandling.jwtVerify, userGuard],
  joinedFilesController.getJoinedFilesById
);
router.get(
  "/files/getall/:userId?",
  [jwtHandling.jwtVerify, userGuard],
  uploadController.getUserSingleFiles
);
router.delete(
  "/join/file/delete/:id",
  [jwtHandling.jwtVerify, userGuard],
  joinedFilesController.deleteJoinedFileFromDB
);
router.get(
  "/download/file/:id",
  [jwtHandling.jwtVerify, userGuard],
  uploadController.downloadFileById
);
router.get(
  "/files/joined/getall/:userId?",
  [jwtHandling.jwtVerify, userGuard],
  joinedFilesController.getUserJoinedFiles
);
router.get(
  "/files/joined/getbyid/:id",
  [jwtHandling.jwtVerify, userGuard],
  joinedFilesController.downloadJoinedFileById
);

//router.post("/:uploadType/:userId" , upload.single("file") , uploadController.uploadProcess) //upload files

module.exports = router;
