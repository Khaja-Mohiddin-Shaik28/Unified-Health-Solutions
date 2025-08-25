const User = require("../model/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    const hashedPassword = await bcrypt.hash(data.password, 10);

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

module.exports = {
  register,
  duplicateUserIdChecker,
};

