const {Schema,model} = require("mongoose");

const userSchema = new Schema({
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    role:{
        type:String,
        enum:["employee","jobseeker","admin"],
        default:"jobseeker",
        required:true
    },
    password:{
        type:String,
        required:true
    },  
    
},{timestamps:true})

const userModel = model("User",userSchema)

module.exports = userModel