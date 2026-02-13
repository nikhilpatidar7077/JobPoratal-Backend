const {Schema,model} = require("mongoose");


const employeeProfileSchema = new Schema ({
    user:{
        type:Schema.Types.ObjectId,ref:"User"
    },
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    address:{
        type:String,
        required:true
    },
    companyName:{
        type:String,
        required:true
    },
    designation:{
        type:String,
        required:true
    }
})

const employeeProfileModel = model("employeeProfile",employeeProfileSchema);

module.exports = employeeProfileModel