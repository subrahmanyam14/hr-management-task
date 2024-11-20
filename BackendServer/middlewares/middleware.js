const LoginSchema = require("../models/loginModel");
const {verifyToken} = require("../utils/generateToken");
const middleware = async (req, res, next) => {
    try {
        const headers = req.headers;
        if(!headers.authorization) {
            return res.status(401).send({message: "Unauthorized 1"});
        }

        const token = headers.authorization.split(" ")[1];
        const decoded = await verifyToken(token);
        if(!decoded) {
            return res.status(401).send({message: "Unauthorized 2"});
        }
        const user = await LoginSchema.findOne({f_userName: decoded.username});
        if(!user) {
            return res.status(401).send({message: "Unauthorized 3"});
        }
        req.loginDetails = user.f_userName;
        next();
    } catch (error) {
        console.log("Error in the middleware, ", error);
        return res.status(500).send({message: "Internal Server Error"});
    }
}

module.exports = middleware;