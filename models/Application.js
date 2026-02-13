const {Schema,model} = require("mongoose");

const applicationSchema = new Schema(
  {
    job: {
      type: Schema.Types.ObjectId,
      ref: "Jobs",
      required: true
    },
    jobSeeker: {
      type: Schema.Types.ObjectId,
      ref: "User",
    //   required: true
    },
    status: {
      type: String,
      enum: ["applied", "shortlisted", "rejected"],
      default: "applied"
    }
  },
  { timestamps: true }
);

const jobApplicationModel = model("Application", applicationSchema);

module.exports = jobApplicationModel
