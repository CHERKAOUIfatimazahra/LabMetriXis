const mongoose = require("mongoose");
const { Schema } = mongoose;

const sampleSchema = new Schema({
  identification: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  quantity: { type: String, required: true },
  storageConditions: [{ type: String }],
  storageLocation: [{ type: String }],
  technician: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  collectionDate: { type: Date },
  expirationDate: { type: Date },
  protocolFile: {
    fileName: { type: String },
    fileLocation: { type: String },
    fileType: { type: String },
    uploadDate: { type: Date, default: Date.now },
  },
  sampleReport: { type: String, required: true },
  status: {
    type: String,
    enum: ["Available", "In Use", "Depleted", "Compromised", "Reserved"],
    default: "Available",
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: "Project",
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Sample", sampleSchema);