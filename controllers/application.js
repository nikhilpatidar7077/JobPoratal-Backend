const Job = require("../models/Job");
const Application = require("../models/Application");

const appliedJobs = async (req, res) => {
  try {
    const id = req.user.id;

    const applications = await Application.find({
      jobSeeker: id,
    })
      .populate({
        path: "job",
        select:
          "jobtitle location jobtype description qualifications responsibilities salaryrange",
        populate: { path: "company", select: "companyName address phone" },
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Job Seeker Apply
const applyJobs = async (req, res) => {
  try {
    const jobSeekerId = req.user.id; // from JWT
    const id = req.params.id;
    console.log("JobSeekerId", jobSeekerId);
    console.log("id--------", id);

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // prevent duplicate apply
    const alreadyApplied = await Application.findOne({
      job: id,
      jobSeeker: jobSeekerId,
      employer: job.userId,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "Already applied for this job",
      });
    }

    const application = await Application.create({
      job: id,
      jobSeeker: jobSeekerId,
      employer: job.userId, // employer id from job
    });

    res.status(201).json({
      success: true,
      message: "Job applied successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { applyJobs, appliedJobs };
