const express = require("express");
const jwtAuth = require("../middlewares/auth");
const {getMyProfile,createJobSeekerProfile,createEmployeeProfile, updateJobSeekerProfile, updateEmployeeProfile, changePassword} = require("../controllers/profile");
const upload = require("../middlewares/upload");
const router = express.Router();


router.get("/my",jwtAuth,getMyProfile);
router.post("/jobseeker",jwtAuth,upload.single("resume"),createJobSeekerProfile)
router.put("/jobseeker/updateprofile",jwtAuth,upload.single("resume"),updateJobSeekerProfile)
router.put("/employee/updateprofile",jwtAuth,updateEmployeeProfile)
router.post("/employee",jwtAuth,createEmployeeProfile)
router.put("/changepassword",jwtAuth,changePassword)
// router.get("/appliedjobs",jwtAuth,appliedJobs)

module.exports = router
