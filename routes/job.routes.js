const express = require("express");
const jwtAuth = require("../middlewares/auth");
const {getJobsForJobSeeker,getJobsList,jobApplicants,createJob,updateJob,deleteJob,applicantsStatus} = require("../controllers/Job");
const router = express.Router();

router.get("/alljobs",jwtAuth,getJobsForJobSeeker)
router.get("/joblist",jwtAuth,getJobsList);
router.get("/applicants/:id",jwtAuth,jobApplicants)
router.post("/createjob",jwtAuth,createJob);
router.put("/updatejob/:id",jwtAuth,updateJob);
router.delete("/deletejob/:id",jwtAuth,deleteJob);
router.put("/applicants/status/:id",jwtAuth,applicantsStatus)

module.exports = router;