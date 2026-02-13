const express = require("express");
const jwtAuth = require("../middlewares/auth");
const {createJob, getJobsList,updateJob, deleteJob, getJobSeekerList, getEmployeeList} = require("../controllers/Admin");
const router = express.Router();

router.get("/jobseekerlist",jwtAuth,getJobSeekerList)
router.get("/employeelist",jwtAuth,getEmployeeList)
router.post("/createjob",jwtAuth,createJob)
router.put("/updatejob/:id",jwtAuth,updateJob)
router.get("/jobs",jwtAuth,getJobsList)
router.delete("/deletejob/:id",jwtAuth,deleteJob)

module.exports = router
