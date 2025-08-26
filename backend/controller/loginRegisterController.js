const User = require("../model/userSchema");
const Otp = require("../model/otpSchema")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require('dotenv').config();

const register = async (req, res) => {
  try {
    const data = req.body;

    // checking if username already exists
    const existingUserId = await User.findOne({ userId: data.userId });
    if (existingUserId) {
      return res.status(409).json({ status: "Username already exists" });
    }

    // checking if email already exists
    const existingEmailId = await User.findOne({ emailId: data.emailId });
    if (existingEmailId) {
      return res.status(409).json({ status: "User already exists" });
    }

    //password hashing
   const salt = await bcrypt.genSalt(10); // 10 is the cost factor
  const hashedPassword = await bcrypt.hash(data.password, salt);

    // Updating password
    const credentials = {
      ...data,
      password: hashedPassword,
      role: "user",
    };

    // adding user to the database
    const addUser = new User(credentials);
    await addUser.save();
    return res.status(201).json({ status: "User added" });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ status: `User not added : ${err.message}` });
  }
};

const duplicateUserIdChecker = async (req, res) => {
  try {
    const { userId } = req.body;
    const duplicateUserId = await User.findOne({ userId });
    if (duplicateUserId) {
      return res.status(409).json({ status: "UserId already exists" });
    } else {
      return res.status(200).json({ status: "ok" });
    }
  } catch (err) {
    return res.status("400").json({ status: err.message });
  }
};

const login = async (req, res) => {
  try {
    const data = req.body;
    // checking if user exists or not
    const existingUserData = await User.findOne({ emailId: data.emailId });

    // if emailId doesn't exist
    if (!existingUserData) {
      return res.status(404).json({ status: "User does not exist" });
    }

    // if emailId exist then we compare passwords
    const validPassword = await bcrypt.compare(
      data.password,
      existingUserData.password
    );
    if (!validPassword) {
      return res.status(401).json({ status: "Invalid Password" });
    } else {
      // Creating a jwt token
      const token = jwt.sign(
        { userId: existingUserData.userId },
        process.env.key,
        {
          expiresIn: "1d",
        }
      );

      // storing token in a cookie
      // maxAge: 1 * 24 * 60 * 60 * 1000, 
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
      });

      return res.status(200).json({ status: existingUserData });
    }
  } catch (err) {
    return res.status(404).json({ status: `Login failed ${err.msg}` });
  }
};

const sendOtp = async (req, res) => {
  const { emailId } = req.body;

  // If emailId is sent as object, convert to string
  const emailIdString = typeof emailId === 'object' ? emailId.emailId : emailId;

  if (!emailIdString) return res.status(400).json({ status: "Email required" });

  try {
    // Check if email exists in User DB
    const existingUser = await User.findOne({ emailId: emailIdString });
    if (!existingUser) {
      return res.status(404).json({ status: "Email not registered" });
    }

    // Generate 6-digit secure OTP
    const otpPlain = crypto.randomInt(100000, 999999).toString();

    // Hash OTP
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otpPlain, salt);

    // Expiration 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Save OTP in DB
    await Otp.findOneAndUpdate(
      { emailId: emailIdString },
      { otp: hashedOtp, expiresAt, createdAt: new Date() },
      { upsert: true }
    );

    // Send OTP email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: emailIdString,
      subject: "Your OTP for Password Reset",
      text: `Your OTP is ${otpPlain}. It is valid for 10 minutes.`,
    });

    res.status(200).json({ status: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "Failed to send OTP" });
  }
};


const verifyOtp = async (req, res) => {
  const { emailId, otp } = req.body;
  
  if (!emailId || !otp) return res.status(400).json({ status: "Email and OTP required" });

  try {
    const record = await Otp.findOne({ emailId });
    if (!record) return res.status(400).json({ status: "No OTP found for this email" });

    if (record.expiresAt < new Date()) {
      await Otp.deleteOne({ emailId });
      return res.status(400).json({ status: "OTP expired" });
    }

    const validOtp = await bcrypt.compare(otp, record.otp);
    if (!validOtp) return res.status(400).json({ status: "Invalid OTP" });

    // OTP valid → remove from DB
    await Otp.deleteOne({ emailId });

    res.status(200).json({ status: "OTP verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "Failed to verify OTP" });
  }
};



const resetPassword = async (req, res) => {
  const { emailId, newPassword } = req.body;

  if (!emailId || !newPassword)
    return res.status(400).json({ status: "Email and new password required" });

  try {
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password
    const user = await User.findOneAndUpdate(
      { emailId },
      { password: hashedPassword },
      { new: true }
    );

    if (!user)
      return res.status(404).json({ status: "User not found" });

    res.status(200).json({ status: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "Failed to reset password" });
  }
};

module.exports = { resetPassword };


module.exports = {
  register,
  duplicateUserIdChecker,
  login,
  sendOtp,
  verifyOtp,
  resetPassword
};
