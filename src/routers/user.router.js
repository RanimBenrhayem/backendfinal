const express = require("express");
const { getUsersById } = require("../controllers/user.controller");
const AdminEmail = require("../services/adminEmailService");
const router = express.Router();
const userController = require("../controllers/user.controller");
const adminGuard = require("../guards/admin.guard");
const jwtHandling = require("../services/jwt");
const userGuard = require("../guards/user.guard");


router.post("/signup", userController.signup);
router.post("/signin", userController.signin);
//router.get("/files/:userId?" , [jwtHandling.jwtVerify , userGuard], userController.getAllFilesForOneUser)
router.delete(
  "/deleteuser/:id",
  [jwtHandling.jwtVerify, userGuard],
  userController.deleteuser
);
router.delete(
  "/deleteprofile",
  [jwtHandling.jwtVerify, userGuard],
  userController.deleteprofile
);
router.get(
  "/userslist",
  [jwtHandling.jwtVerify, adminGuard],
  userController.userslist
);
router.put(
  "/updateuser/:id?",
  [jwtHandling.jwtVerify, userGuard],
  userController.updateuser
);
router.get("/userById/:userId", userController.getUsersById);
router.post("/sendEmail/", [jwtHandling.jwtVerify, adminGuard], AdminEmail);
router.post("/googlesignin", userController.googlesignin);
router.get(
  "/profilInfo/:userId?",
  [jwtHandling.jwtVerify, userGuard],
  userController.getProfilInfo
);
router.post(
  "/comparePassword/:userId?",
  [jwtHandling.jwtVerify, userGuard],
  userController.comparePassword
);
router.post(
  "/setNewPassword/:userId?",
  [jwtHandling.jwtVerify, userGuard],
  userController.setNewPassword
);

module.exports = router;