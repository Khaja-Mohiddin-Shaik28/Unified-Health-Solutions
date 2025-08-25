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
      const token = jwt.sign({ userId: existingUserData.userId }, process.env.key, {
        expiresIn: "1hr",
      });

      // storing token in a cookie
      res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
      return res.status(200).json({ status: existingUserData });
    }

  } catch (err) {
    return res.status(404).json({ status: `Login failed ${err.msg}` });
  }
};


module.exports = {
  register,
  duplicateUserIdChecker,
  login
};

