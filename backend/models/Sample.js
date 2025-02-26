const mongoose = require("mongoose");
const { Schema } = mongoose;

const sampleSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  storageConditions: { type: String },
  collectionDate: { type: Date, required: true },
  expirationDate: { type: Date },
  status: {
    type: String,
    enum: ["Pending", "In Analysis", "Analyzed", "Archived"],
    default: "Pending",
  },
  protocolFile: {
    fileName: { type: String },
    fileLocation: { type: String },
    fileType: { type: String },
    uploadDate: { type: Date, default: Date.now },
  },
  technicianResponsible: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  analysisReport: { type: String },
  project: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
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
