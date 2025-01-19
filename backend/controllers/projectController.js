const Project = require("../models/Project");
const Sample = require("../models/Sample");
const Report = require("../models/Report");

// Project Management Controllers
exports.createProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    const project = new Project({
      title,
      description,
      createdBy: req.user.id,
      status: "In Progress",
    });

    await project.save();
    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user.id })
      .populate("samples")
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      createdBy: req.user.id,
    }).populate("samples");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const project = await Project.findOneAndUpdate(
      { _id: req.params.projectId, createdBy: req.user.id },
      { title, description, status },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project updated successfully", project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Sample Management Controllers
exports.getSamplesByProject = async (req, res) => {
  try {
    const samples = await Sample.find({
      project: req.params.projectId,
      project: { createdBy: req.user.id },
    }).populate("assignedTo");

    res.json(samples);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.requestSampleAnalysis = async (req, res) => {
  try {
    const { sampleId } = req.params;
    const { analysisType, priority } = req.body;

    const sample = await Sample.findOneAndUpdate(
      {
        _id: sampleId,
        project: { createdBy: req.user.id },
      },
      {
        status: "In Progress",
        $push: {
          analysisRequests: {
            type: analysisType,
            priority,
            requestedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!sample) {
      return res.status(404).json({ message: "Sample not found" });
    }

    res.json({ message: "Analysis requested successfully", sample });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Analysis and Reporting Controllers
exports.createReport = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { content, type, sampleId } = req.body;

    const report = new Report({
      type,
      content,
      createdBy: req.user.id,
      project: projectId,
      sample: sampleId || null,
    });

    await report.save();

    // Update project or sample status if needed
    if (type === "Project") {
      await Project.findByIdAndUpdate(projectId, {
        status: "Pending Reports",
        "finalReport.content": content,
        "finalReport.publishedAt": new Date(),
      });
    } else if (type === "Sample") {
      await Sample.findByIdAndUpdate(sampleId, {
        status: "Completed",
        "report.content": content,
        "report.createdAt": new Date(),
      });
    }

    res.status(201).json({ message: "Report created successfully", report });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProjectReports = async (req, res) => {
  try {
    const reports = await Report.find({
      project: req.params.projectId,
      project: { createdBy: req.user.id },
    })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSampleAnalysisHistory = async (req, res) => {
  try {
    const sample = await Sample.findOne({
      _id: req.params.sampleId,
      project: { createdBy: req.user.id },
    }).populate({
      path: "report",
      populate: {
        path: "createdBy",
        select: "name email",
      },
    });

    if (!sample) {
      return res.status(404).json({ message: "Sample not found" });
    }

    res.json(sample);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
