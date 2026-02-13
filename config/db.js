const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
    try {
        const conn = mongoose.connect(process.env.MONGO_URI_LOCAL)
        console.log('mongodb connected successfully')
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectDB