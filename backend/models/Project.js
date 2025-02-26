const mongoose = require("mongoose");
const { Schema } = mongoose;

const projectSchema = new Schema({
  projectName: { type: String, required: true },
  researchDomain: { type: String, required: true },
  teamLead: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  teamMembers: [
    {
      user: { type: Schema.Types.ObjectId, ref: "User" },
      role: { type: String },
    },
  ],
  fundingSource: { type: String },
  budget: { type: Number },
  startDate: { type: Date, required: true },
  deadline: { type: Date, required: true },
  status: {
    type: String,
    enum: ["Planning", "Active", "Completed", "On Hold", "Cancelled"],
    default: "Planning",
  },
  collaboratingInstitutions: { type: String },
  description: { type: String, required: true },
  expectedOutcomes: { type: String },
  samples: [
    {
      type: Schema.Types.ObjectId,
      ref: "Sample",
    },
  ],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  finalReport: {
    content: { type: String },
    publishedAt: { type: Date },
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Project", projectSchema);
