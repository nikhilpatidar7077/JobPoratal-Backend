const jwt = require("jsonwebtoken");

const authJWT = async (req,res,next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if(!token){
            res.status(400).json({
                message:"Token are required"
            })
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        res.status(401).json({
            message:"Invalid or expire token"
        })
    }
}

module.exports = authJWT