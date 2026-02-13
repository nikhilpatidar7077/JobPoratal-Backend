const mongoose = require("mongoose");
const Job = require("../models/Job");
const Employee = require("../models/EmployeeProfile");
const JobSeeker = require("../models/JobSeekerProfile");
const Application = require("../models/Application");

const getJobsForJobSeeker = async (req, res) => {
  try {
    const { keyword, location, jobtype } = req.query;
    let filter = {};

    if (keyword) {
      filter.$or = [
        { jobtitle: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }
    if (jobtype) {
      filter.jobtype = jobtype;
    }
    const jobs = await Job.find(filter)
     .populate(
        "company",
        "companyName address phone designation"
      ).sort({ createdAt: -1 })
    //  .populate({
    // path: "employee",
    // select: "fullname email company",
    // populate: {
    //   path: "company",
    //   select: "companyName address phone designation",
    // }})
    // .populate({
    //     path: "employee",
    //     select: "fullname email",
    //   })
    //   .populate({
    //     path: "employee",
    //     populate: {
    //       path: "company",
    //       select: "employeeProfile"
    //     }
    //   });
    res.status(200).json({
      sucess: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    res.status(200).json({
      sucess: false,
      message: error.message,
    });
  }
};

const getJobsList = async (req, res) => {
  try {
    const { id, role } = req.user;
    if (!id) {
      return res.status(404).json({
        message: "Id not found",
      });
    }
    // if (role !== "employee") {
    //   return res.status(400).json({
    //     message: `You are employee not ${user.role}, please login again`,
    //   });
    // }
    const jobsList = await Job.find({ employee: id });
    if (jobsList.length === 0) {
      return res.json({
        message: "Jobs not createAt",
      });
    }
    res.status(200).json({
      sucess: true,
      data: jobsList,
    });
  } catch (error) {
    res.status(500).json({
      sucess: false,
      message: error.message,
    });
  }
};

const jobApplicants = async (req, res) => {
  try {
    const employerId = req.user.id;
    const jobId = req.params.id;

    const applications = await Application
      .find({ job: jobId }).populate("jobSeeker","fullname email")

      const userIds = applications
      .map(app => app.jobSeeker?._id)
      .filter(Boolean);

    // Step 3: Get jobSeeker profiles
    const profiles = await JobSeeker
      .find({ user: { $in: userIds } });

    // Step 4: Merge data
    const formattedData = applications.map(app => {
      const profile = profiles.find(
        p => p.user.toString() === app.jobSeeker?._id.toString()
      );

      return {
        applicationId: app._id,
        fullname: app.jobSeeker?.fullname,
        email: app.jobSeeker?.email,
        phone: profile?.phone || null,
        address: profile?.address || null,
        resume: profile?.resume || null,
        status: app.status
      };
    });
      // const jobSeekerInfo = await JobSeeker.findOne({user:applications.jobSeeker})
      // .populate("job","jobtitle location salaryrange")
      // .populate("job", "jobtitle location salaryrange")
      // .populate({
      //   path: "jobSeeker",
      //   select: "fullname email",
      //   populate: {
      //     path: "profile",
      //     select: "address phone resume",
      //   },
      // });
    // const jobSeekerIds = applications.map(app => app.jobSeeker);

    //   const findJobseeker = await JobSeeker.find({user:jobSeekerIds})

    res.json({
      success: true,
      count: applications.length,
      data: formattedData 
      // jobSeekerIds
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createJob = async (req, res) => {
  try {
    const userinfo = req.user;
    const {
      jobtitle,
      description,
      qualifications,
      responsibilities,
      location,
      salaryrange,
      jobtype,
    } = req.body;
    if (!userinfo.id) {
      return res.status(404).json({
        message: "Id not found",
      });
    }
    // if (userinfo.role !== "employee") {
    //   return res.status(400).json({
    //     message: `You are employee not ${userinfo.role}, please login again`,
    //   });
    // }
    if (
      !jobtitle ||
      !description ||
      !qualifications ||
      !responsibilities ||
      !location ||
      !salaryrange ||
      !jobtype
    ) {
      return res.status(401).json({
        messsage: "All fields are required",
      });
    }
     const companyProfile = await Employee.findOne({
      user: userinfo.id,
    });
     if (!companyProfile) {
      return res.status(400).json({
        success: false,
        message: "Employee profile not found. Create company profile first.",
      });
    }
    await Job.create({
      company:companyProfile._id, 
      employee: userinfo.id,
      jobtitle,
      description,
      qualifications,
      responsibilities,
      location,
      salaryrange,
      jobtype,
    });
    res.status(201).json({
      sucess: true,
      message: "Job created successfully",
    });
  } catch (error) {
    res.status(500).json({
      sucess: false,
      message: error.message,
    });
  }
};

const updateJob = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      jobtitle,
      description,
      qualifications,
      responsibilities,
      location,
      salaryrange,
      jobtype,
    } = req.body;
    if (!id) {
      return res.status(404).json({
        message: "Id not found",
      });
    }
    await Job.findByIdAndUpdate(
      id,
      {
        jobtitle,
        description,
        qualifications,
        responsibilities,
        location,
        salaryrange,
        jobtype,
      },
      { new: true },
    );
    res.status(200).json({
      sucess: true,
      data: "Job updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      sucess: false,
      message: error.message,
    });
  }
};

const deleteJob = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(404).json({
        message: "Id not found",
      });
    }
    await Job.findByIdAndDelete(id);
    res.status(200).json({
      sucess: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      sucess: true,
      message: error.message,
    });
  }
};

const applicantsStatus = async (req, res) => {
  try {
    // const employerId = req.user.id;
    const {status}  = req.body;
    const applicationId = req.params.id

    if (!["applied", "shortlisted", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }
    const application = await Application.findByIdAndUpdate(
      { _id: applicationId },
      { status },
      { new: true },
    );

    res.json({
      success: true,
      message: "Application status updated",
      application
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getJobsForJobSeeker,
  getJobsList,
  jobApplicants,
  createJob,
  updateJob,
  deleteJob,
  applicantsStatus,
};
