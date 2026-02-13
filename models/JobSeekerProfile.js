const { Schema, model } = require("mongoose");

const jobSeekerProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  resume: {
    type: String,
    required: true,
  },
});

// jobSeekerProfileSchema.virtual("profile", {
//   ref: "JobSeekerProfile",
//   localField: "_id",
//   foreignField: "userId",
//   justOne: true
// });

// jobSeekerProfileSchema.set("toObject", { virtuals: true });
// jobSeekerProfileSchema.set("toJSON", { virtuals: true });

const jobSeekerProfileModel = model("JobSeekerProfile", jobSeekerProfileSchema);

module.exports = jobSeekerProfileModel;
