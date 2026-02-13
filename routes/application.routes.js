const express = require("express");
const jwtAuth = require("../middlewares/auth");
const {appliedJobs,applyJobs} = require("../controllers/application")
const router = express.Router();

router.get("/appliedjobs",jwtAuth,appliedJobs)
router.post("/apply/:id",jwtAuth,applyJobs)

module.exports = router