const { Schema, model } = require("mongoose");

const jobsSchmema = new Schema({
  employee: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  company: { type: Schema.Types.ObjectId, ref: "employeeProfile" },
  jobtitle: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  qualifications: {
    type: String,
    required: true,
  },
  responsibilities: {
    type: String,
    required: true,
  },
   jobtype: {
    type: String,
    enum: ["full-time", "part-time", "remote", "internship"]
  },
  location: {
    type: String,
    required: true,
  },
  salaryrange: {
    type: String,
    required: true,
  }},
  {
  timestamps:true
  }
);

const jobsModel = model("Jobs",jobsSchmema)

module.exports = jobsModel
