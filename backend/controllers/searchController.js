const Project = require("../models/Project");

exports.searchProjects = async (req, res) => {
  try {
    const { query, status, page = 1, limit = 10 } = req.query;

    // Build search criteria
    let searchCriteria = {
      $or: [
        { createdBy: req.user.id },
        { teamLead: req.user.id },
        { "teamMembers.user": req.user.id },
      ],
    };

    if (query) {
      searchCriteria.$and = [
        {
          $or: [
            { projectName: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
            { researchDomain: { $regex: query, $options: "i" } },
          ],
        },
      ];
    }

    if (status && status !== "All") {
      searchCriteria.status = status;
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await Project.countDocuments(searchCriteria);

    // Get paginated results
    const projects = await Project.find(searchCriteria)
      .populate("teamLead", "firstName lastName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Calculate progress for each project
    const projectsWithProgress = await Promise.all(
      projects.map(async (project) => {
        const totalSamples = project.samples.length;
        const analyzedSamples = project.samples.filter(
          (sample) => sample.status === "Analyzed"
        ).length;
        const progress =
          totalSamples === 0
            ? 0
            : Math.round((analyzedSamples / totalSamples) * 100);

        return {
          ...project.toObject(),
          progress,
          teamLeadName: `${project.teamLead.firstName} ${project.teamLead.lastName}`,
        };
      })
    );

    res.json({
      projects: projectsWithProgress,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: error.message });
  }
};

