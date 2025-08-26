const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  emailId: { type: String, required: true },
  otp: { type: String, required: true }, // hashed OTP
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Otp", otpSchema);
