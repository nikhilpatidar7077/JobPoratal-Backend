const mongoose = require("mongoose");
const Job = require("../models/Job");
const Employee = require("../models/EmployeeProfile");
const JobSeeker = require("../models/JobSeekerProfile");
const User = require("../models/User");
const Application = require("../models/Application");

const getJobSeekerList = async(req,res)=>{
  try {
    const usersList = await JobSeeker.find().populate("user","fullname email")
    const formattedUsers = usersList.map((item) => ({
      id: item.user?._id,
      fullname: item.user?.fullname,
      email: item.user?.email,
      phone: item.phone,
      address: item.address,
      resume: item.resume,
    }));
    res.status(200).json({
      success:true,
      data:formattedUsers
    })
  } catch (error) {
    res.status(500).json({
      success:false,
      message:error.message
    })
  }
}

const getEmployeeList = async (req,res) => {
  try {
       const employeeList = await Employee.find({user:{$ne:null}}).populate("user","fullname email").select("comapnyName designation phone address")
       const formattedEmployees = employeeList.map((item)=>({
        id:item.user?._id,
        fullname:item.user?.fullname,
        email:item.user?.email,
        companyName:item.companyName,
        designation:item.designation,
        address:item.address,
        phone:item.phone,
       }))
       res.status(200).json({
        success:true,
        data:formattedEmployees
       })
  } catch (error) {
    res.status(500).json({
      success:false,
      message:error.message
    })
  }
}

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
    const jobsList = await Job.find({ employee: id }).populate("company")
    if (jobsList.length === 0) {
      return res.json({
        message: "Jobs not createAt",
      });
    }
    res.status(200).json({
      success: true,
      data: jobsList,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
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
      companyName,
      designation,
      phone,
      address
    } = req.body;
    if (!userinfo.id) {
      return res.status(404).json({
        message: "Id not found",
      });
    }
    if (
      !jobtitle ||
      !description ||
      !qualifications ||
      !responsibilities ||
      !location ||
      !salaryrange ||
      !jobtype ||
      !companyName ||
      !designation ||
      !address ||
      !phone
    ) {
      return res.status(401).json({
        messsage: "All fields are required",
      });
    }
 let company = await Employee.findOne({ companyName });

    // 2️⃣ If not exists → create company
    if (!company) {
      company = await Employee.create({
        companyName,
        designation,
        phone,
        address,
        // optional: createdBy: req.user.id
      });
    }
    await Job.create({
      company:company._id, 
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
      success: true,
      message: "Job created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateJob = async (req, res) => {
  try {
    const jobid = req.params.id;
    // const companyId = req.params.comp
    const {
      jobtitle,
      description,
      qualifications,
      responsibilities,
      location,
      salaryrange,
      jobtype,
      companyName,
      designation,
      phone,
      address
    } = req.body;
    const job = await Job.findById(jobid).populate("company");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    // 2️⃣ Update job fields if provided
    job.jobtitle = jobtitle || job.jobtitle;
    job.description = description || job.description;
    job.qualifications = qualifications || job.qualifications;
    job.responsibilities = responsibilities || job.responsibilities;
    job.location = location || job.location;
    job.salaryrange = salaryrange || job.salaryrange;
    job.jobtype = jobtype || job.jobtype;

    await job.save();

    // 3️⃣ Update company fields
    if (job.company) {
      job.company.companyName = companyName || job.company.companyName;
      job.company.designation = designation || job.company.designation;
      job.company.phone = phone || job.company.phone;
      job.company.address = address || job.company.address;

      await job.company.save();
    }

    res.status(200).json({
      success: true,
      message: "Job and Company updated successfully",
      job
    });
    // if (!id) {
    //   return res.status(404).json({
    //     message: "Id not found",
    //   });
    // }
    // const companyInfo = await Employee.findOne({user:userId})
    // await Employee.findByIdAndUpdate({
    //   _id:companyInfo._id},{
    //     companyName,
    //   designation,
    //   phone,
    //   address
    //   },{new:true}
    // )
    // await Job.findByIdAndUpdate(
    //   id,
    //   {
    //     jobtitle,
    //     description,
    //     qualifications,
    //     responsibilities,
    //     location,
    //     salaryrange,
    //     jobtype,
    //   },
    //   { new: true },
    // );
    // res.status(200).json({
    //   sucess: true,
    //   data: "Job updated successfully",
    // });
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
    const jobInfo = await Job.findById(id)
    const companyInfo = jobInfo.company


    await Job.findByIdAndDelete(id);
    await Employee.findByIdAndDelete(companyInfo)

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

const updateProfile = async(req,res) => {
try {
  const {fullname,email} = req.body
  const id = req.user.id
  await User.findByIdAndUpdate(id,{fullname,email},{new:true})
  res.status(200).json({
    success:true,
    message:"Profile updated succesfully"
  })
} catch (error) {
  res.status(500).json({
    success:false,
    message:error.message
  })
}
}

module.exports = {getJobSeekerList,getEmployeeList,createJob,getJobsList,updateJob,deleteJob,updateProfile}