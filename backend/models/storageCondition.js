const mongoose = require("mongoose");
const { Schema } = mongoose;

const storageCondition = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  temperature: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("StorageCondition", storageCondition);