const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  role: {
    type: String,
    enum: ["Admin", "Chercheur", "Technicien"],
    default: "Chercheur",
  },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },
  verificationToken: { type: String },
  lastOTPSentAt: { type: Date },
});

module.exports = mongoose.model("User", userSchema);
