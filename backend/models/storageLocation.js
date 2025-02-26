const mongoose = require("mongoose");
const { Schema } = mongoose;

const storageLocationSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  type: { type: String }, // e.g., Freezer, Refrigerator, Room temperature
  building: { type: String },
  room: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("StorageLocation", storageLocationSchema);