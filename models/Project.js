const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    samples: [{ type: mongoose.Schema.Types.ObjectId, ref: "Sample" }],
    status: {
      type: String,
      enum: ["In Progress", "Pending Reports", "Completed"],
      default: "In Progress",
    },
    finalReport: {
      content: { type: String, default: null },
      publishedAt: { type: Date, default: null },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);
