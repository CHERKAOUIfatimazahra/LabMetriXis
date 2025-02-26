const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "chercheur", "technicien"],
    default: "chercheur",
  },
  institution: { type: String },
  specialty: { type: String },
  profileImage: { type: String },

  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },
  otpLastValidated: { type: Date },
  verificationToken: { type: String },
  lastOTPSentAt: { type: Date },
});

module.exports = mongoose.model("User", userSchema);
