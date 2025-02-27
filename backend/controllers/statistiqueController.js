const Project = require("../models/Project");
const Sample = require("../models/Sample");

exports.getProjectStatistics = async (req, res) => {
  try {
    // Get base project query for user's projects
    const baseQuery = {
      $or: [
        { createdBy: req.user.id },
        { teamLead: req.user.id },
        { "teamMembers.user": req.user.id },
      ],
    };

    // Get total projects count
    const totalProjects = await Project.countDocuments(baseQuery);

    // Get projects by status
    const statusCounts = await Project.aggregate([
      { $match: baseQuery },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Get projects by research domain
    const domainStats = await Project.aggregate([
      { $match: baseQuery },
      { $group: { _id: "$researchDomain", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Get total budget allocation
    const budgetStats = await Project.aggregate([
      { $match: baseQuery },
      {
        $group: {
          _id: null,
          totalBudget: { $sum: "$budget" },
          avgBudget: { $avg: "$budget" },
          maxBudget: { $max: "$budget" },
          minBudget: { $min: "$budget" },
        },
      },
    ]);

    // Get sample statistics
    const sampleStats = await Sample.aggregate([
      {
        $lookup: {
          from: "projects",
          localField: "project",
          foreignField: "_id",
          as: "project",
        },
      },
      { $unwind: "$project" },
      { $match: baseQuery },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Format the response
    const statistics = {
      totalProjects,
      statusDistribution: statusCounts.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      topResearchDomains: domainStats,
      budgetStatistics: budgetStats[0] || {
        totalBudget: 0,
        avgBudget: 0,
        maxBudget: 0,
        minBudget: 0,
      },
      sampleStatistics: sampleStats.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
    };

    res.json(statistics);
  } catch (error) {
    console.error("Statistics error:", error);
    res.status(500).json({ error: error.message });
  }
};
