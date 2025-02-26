const Project = require("../models/Project");
const Sample = require("../models/Sample");

// Project Management Controllers
exports.createProject = async (req, res) => {
  try {
    const {
      projectName,
      researchDomains,
      teamLead,
      fundingSource,
      budget,
      startDate,
      deadline,
      status,
      collaboratingInstitutions,
      description,
      expectedOutcomes,
      teamMembers,
    } = req.body;

    // Validate required fields
    if (
      !projectName ||
      !researchDomains ||
      !teamLead ||
      !startDate ||
      !deadline ||
      !description
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create project
    const project = new Project({
      projectName,
      researchDomain: researchDomains,
      teamLead,
      teamMembers: teamMembers.map((member) => ({
        user: member.id,
        role: member.role,
      })),
      fundingSource,
      budget,
      startDate,
      deadline,
      status,
      collaboratingInstitutions,
      description,
      expectedOutcomes,
      createdBy: req.user._id,
    });

    await project.save();

    res.status(201).json({
      message: "Project created successfully",
      project,
      projectId: project._id,
    });
  } catch (error) {
    console.error("Project creation error:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
};

exports.addSampleToProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const sampleData = req.body;

    // Create new sample with project reference
    const sample = new Sample({
      ...sampleData,
      project: projectId,
      createdBy: req.user._id,
      technicianResponsible: sampleData.technician || req.user._id,
    });

    await sample.save();

    // Add sample reference to project
    await Project.findByIdAndUpdate(projectId, {
      $push: { samples: sample._id },
    });

    res.status(201).json({
      message: "Sample added successfully",
      sample,
    });
  } catch (error) {
    console.error("Error adding sample:", error);
    res.status(500).json({ error: "Failed to add sample" });
  }
};


exports.getSamplesByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const samples = await Sample.find({ project: projectId }).sort({
      createdAt: -1,
    });
    res.json(samples);
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
exports.createSample = async (req, res) => {
  try {
    const { name, description, project } = req.body;
    const sample = await Sample.create({
      name,
      description,
      project: project._id,
      createdBy: req.user.id,
      status: "Assigned",
      assignedTo: project.createdBy,
    });
    res.json(sample);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSample = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const sample = await Sample.findOneAndUpdate(
      { _id: req.params.sampleId, createdBy: req.user.id },
      { name, description, status },
      { new: true }
    );
    res.json(sample);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSample = async (req, res) => {
  try {
    const sample = await Sample.findOneAndDelete({
      _id: req.params.sampleId,
      createdBy: req.user.id,
    });
    res.json({ message: "Sample deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSampleById = async (req, res) => {
  try {
    const sample = await Sample.findOne({
      _id: req.params.sampleId,
    });
    res.json(sample);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSamplesByProject = async (req, res) => {
  try {
    const samples = await Sample.find({
      project: req.params.projectId,
    });

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
