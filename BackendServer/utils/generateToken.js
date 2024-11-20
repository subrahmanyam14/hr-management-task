const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

const generateToken = async (username) => {
    const token = await jwt.sign({username}, process.env.JWT_SECRET, {expiresIn: '1d'});
    return token;
}

const verifyToken = async (token) => {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
}



module.exports = {generateToken, verifyToken, encryptPassword};