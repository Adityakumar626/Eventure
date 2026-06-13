import User from "../models/User.js";
import bcrypt from "bcrypt";
import { sendOtpEmail } from "../utils/email.js";
import OTP from "../models/OTP.js";
import jwt from "jsonwebtoken";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      isverified: false,
    }); // creating and saving user in db

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`otp for ${email} is ${otp}`);

    await OTP.create({ email, otp, action: "account_verification" }); // saving otp in db
    await sendOtpEmail(email, otp, "account_verification");
    res.status(201).json({
      message:
        "User registered successfully. Please check your email for OTP to verify your account.",
      email: user.email,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        error: "Invalid Credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        error: "Invalid Credentials",
      });
    }

    if (!user.isverified && user.role === "user") {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await OTP.deleteMany({ email, action: "account_verification" }); // removes old otps
      await OTP.create({ email, otp, action: "account_verification" }); // creates and save new otp in db
      await sendOtpEmail(email, otp, "account_verification");
      return res.status(403).json({
        error: "Account not verifies. New otp has sent to the email",
      });
    }

    res.status(200).json({
      message: "Login Successful",
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Verify Otp
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const otpRecord = await OTP.findOne({
      email,
      otp,
      action: "account_verification",
    });

    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { isverified: true },
      { new: true },
    );
    await OTP.deleteMany({ email, action: "account_verification" }); // removes used OTPs
    res.json({
      message: "Account verified successfully. You can log in now.",
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
