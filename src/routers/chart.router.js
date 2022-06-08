const express = require("express");
const router = express.Router();
const chartController = require("../controllers/chart.controller")
const jwtHandling = require("../services/jwt");
const userGuard = require("../guards/user.guard");


router.post("/draw/:id/:userId?" ,[jwtHandling.jwtVerify , userGuard], chartController.drawSimple)
router.post('/save/database',[jwtHandling.jwtVerify , userGuard], chartController.saveDashboardIntoDataBase)
router.get("/all" , [jwtHandling.jwtVerify , userGuard] , chartController.getAllSavedDashboard)
router.get("/joined/all" , [jwtHandling.jwtVerify , userGuard] , chartController.getAllSavedJoinedDashboards)
router.get("/one/:id" , chartController.getOneSavedDashboard)
router.delete("/delete/:id" , chartController.deleteSavedChart)
router.post("/joined/draw/:id" , chartController.drawChartForJoinedFiles)
router.get("/joined/one/:id" , chartController.getOneSavedJoinedDashboard)
router.post("/alert/simple/add/:id" , [jwtHandling.jwtVerify , userGuard] , chartController.addAlertForSimpleFile)
router.post("/alert/joined/add/:id" , [jwtHandling.jwtVerify , userGuard] , chartController.addAlertForJoinedFile)
router.delete("/alert/delete/:id" , chartController.deleteAlertForSimpleFile)
router.get("/alert/simple/all" ,[jwtHandling.jwtVerify , userGuard], chartController.getAlertsForSimpleFiles)
router.get("/alert/joined/all" ,[jwtHandling.jwtVerify , userGuard], chartController.getAlertsForJoinedFiles)



module.exports = router;
