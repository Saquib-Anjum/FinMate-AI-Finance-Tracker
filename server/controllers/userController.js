import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import profileModel from "../models/ProfileModel.js";
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password is required",
      });
    }
    const user = await userModel.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }
    const compare = await bcrypt.compare(password, user.password);
    if (!compare) {
      return res.status(409).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    const token = generateToken({
      userId: user._id,
    });
    res.json({
      success: true,
      message: "You are Loggedin ...",
      token,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(403).json({
        success: false,
        message: "Above Fields are required",
      });
    }
    const salt = 10;
    const hash = await bcrypt.hash(password, salt);
    const isExist = await userModel.findOne({ email });
    if (isExist) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }
    const user = await userModel.create({
      name,
      email,
      password: hash,
    });
    const profile = await profileModel.create({
      userId:user._id
    })
    const token = generateToken({
      userId: user._id,
    
    });
    res.json({
      success: true,
      message: "Signup SuccessFull",
      token,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
export { login, signup };
