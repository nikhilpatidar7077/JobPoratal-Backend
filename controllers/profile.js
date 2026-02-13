const bcrypt = require("bcryptjs")
const User = require("../models/User");
const JobSeeker = require("../models/JobSeekerProfile");
const Employee = require("../models/EmployeeProfile");
// const JobApplication = require("../models/jobApllicationModel")

const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(404).json({
        message: "Id not found",
      });
    }
    const user = await User.findById({ _id: userId });
    // const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    let profile = null;
    if (user.role === "jobseeker") {
      profile = await JobSeeker.findOne({ user: userId });
    }
    if (user.role === "employee") {
      profile = await Employee.findOne({ user: userId });
    }
    res.status(200).json({
      sucess: true,
      user,
      profile,
    });
  } catch (error) {
    res.status(500).json({
      sucess: false,
      message: error.message,
    });
  }
};

const createJobSeekerProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    const { phone, address } = req.body;
    if (!userId) {
      return res.status(404).json({
        message: "JobSeeker id not found",
      });
    }
    if (role !== "jobseeker") {
      return res.status(400).json({
        message: `You are jobseeker not ${role}, please login again`,
      });
    }
    if (!phone || !address) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    if (!req.file) {
      return res.status(400).json({
        message: "Resume is required",
      });
    }
    const resumepath = req.file.path.replace(/\\/g, "/");
    await JobSeeker.create({
      user: userId,
      phone,
      address,
      resume: resumepath,
    });
    res.status(201).json({
      sucess: true,
      message: "Profile created successfully",
    });
  } catch (error) {
    res.status(500).json({
      sucess: false,
      message: error.message,
    });
  }
};

const createEmployeeProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    const { phone, address, companyName, designation } = req.body;
    if (!userId) {
      return res.status(404).json({
        message: "Employee id not found",
      });
    }
    if (role !== "employee") {
      return res.status(400).json({
        message: `You are employee not ${role}, please login again`,
      });
    }
    if (!phone || !address || !companyName || !designation) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    await Employee.create({
      user: userId,
      phone,
      address,
      companyName,
      designation,
    });
    res.status(201).json({
      sucess: true,
      message: "Profile created successfully",
    });
  } catch (error) {
    res.status(500).json({
      sucess: false,
      message: error.message,
    });
  }
};

const updateJobSeekerProfile = async (req, res) => {
  try {
    const {fullname,email, phone, address } = req.body;
    const id = req.user.id;
    if (!id) {
      return res.status(404).json({
        message: "Id not found",
      });
    }
    // if (!fullname || !email || !phone || !address) {
    //   return res.status(400).json({
    //     message: "All fields are required",
    //   });
    // }
    // if (!req.file) {
    //   return res.status(400).json({
    //     message: "Resume is required",
    //   });
    // }
    let resumepath;
    if(req.file){
    resumepath = req.file.path.replace(/\\/g, "/");

    }
    const userInfo = await JobSeeker.findOne({ user: id });
    console.log("userInfo",userInfo)
    await JobSeeker.findByIdAndUpdate(userInfo.id, {
      phone,
      address,
      resume: resumepath,
    },{new:true});
    await User.findByIdAndUpdate(id, {
      fullname,
      email,
    },{new:true});
    res.status(200).json({
      sucess:true,
      message:"Profile updated successfully"
    })
  } catch (error) {
    res.status(500).json({
      message:error.message
    })
  }
};

const updateEmployeeProfile = async(req,res) => {
  try {
    const {fullname,email,address,phone,companyName,designation}= req.body
    const id = req.user.id
    if(!id){
      return res.status(404).json({
        message:"Id not found"
      })
    }
    await User.findByIdAndUpdate(id,{
     fullname,
     email
    },{new:true})
    const companyInfo = await Employee.findOne({user:id})
    await Employee.findByIdAndUpdate(companyInfo.id,{
      companyName,
      designation,
      address,
      phone
    },{new:true})
    res.status(200).json({
      sucess:true,
      message:"Profile updated successfully"
    })
  } catch (error) {
    res.status(500).json({
      sucess:false,
      message:error.message
    })
  }
}

const changePassword = async(req,res) =>{
  try {
    const {oldpassword,newpassword} = req.body
    const user = req.user

    const userInfo = await User.findOne({_id:user.id})
    const isMatch = await bcrypt.compare(oldpassword,userInfo.password)
    if(!isMatch){
      return res.status(400).json({
        message:"Invalid password"
      })
    }
    const hashedPassword = await bcrypt.hash(newpassword,10)
    await User.findByIdAndUpdate(userInfo.id,{
      password:hashedPassword
    })
    res.status(200).json({
      success:true,
      message:"Password changed successfully"
    })
  } catch (error) {
    res.status(500).json({
      success:false,
      message:error.message
    })
  }
}

module.exports = {
  getMyProfile,
  createJobSeekerProfile,
  createEmployeeProfile,
  updateJobSeekerProfile,
  updateEmployeeProfile,
  changePassword
};
