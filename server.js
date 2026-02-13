const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");
const jobRoutes = require("./routes/job.routes");
const applicationRoutes = require("./routes/application.routes");
const adminRoutes = require("./routes/admin.routes");

dotenv.config()
const app = express();
connectDB();
const cors = require("cors");
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(express.json());
app.use("/api/auth",authRoutes)
app.use("/api/profile",profileRoutes)
app.use("/api/job",jobRoutes)
app.use("/api/application",applicationRoutes)
app.use("/api/admin",adminRoutes)

app.get("/",(req,res)=>{
    res.send("job portal server is running")
})

app.listen(process.env.PORT,()=>{
    console.log(`PORT running on ${process.env.PORT}`)
})