const LoginSchema = require("../models/loginModel.js");
const { encryptPassword, generateToken } = require("../utils/generateToken");
const bcrypt = require("bcrypt");


const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            {
                return res.status(400).send({ error: "Please provide all the fields..." });
            }
        }
        const user = await LoginSchema.findOne({ f_userName: username });
        if (!user) {
            return res.status(404).send({ error: "User not found..." });
        }
        const isMatch = await bcrypt.compare(password, user.f_Pwd);
        if (!isMatch) {
            return res.status(401).send({ error: "Invalid credentials..." });
        }
        const token = await generateToken(user.f_userName);
        return res.status(200).send({ token });
    } catch (error) {
        console.log("Error in the login , ", error);
        return res.status(500).send({ error: "Internal Server Error..." });
    }
}

const register = async (req, res) => {
    try {
        const { username, password, consfirmPassword } = req.body;
        if (!username || !password || !consfirmPassword) {
            return res.status(400).send({ error: "Please provide all the fields..." });
        }
        if (password !== consfirmPassword) {
            return res.status(400).send({ error: "Password does not match..." });
        }
        const user = await LoginSchema.findOne({ f_userName: username });
        if (user) {
            return res.status(400).send({ error: "User already exists..." });
        }
        const count = await LoginSchema.countDocuments();
        const hashedPassword = await encryptPassword(password);
        const newUser = new LoginSchema({ f_sno: count+1, f_userName: username, f_Pwd: hashedPassword });
        await newUser.save();
        return res.status(200).send({ message: "User registered successfully..." });

    } catch (error) {
        console.log("Error in the register, ", error);
        return res.status(500).send({ error: "Internal Server Error..." });
    }
}

module.exports = { login, register };