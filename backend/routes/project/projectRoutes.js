const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middleware/authMiddleware");
const { isOrganizer } = require("../../middleware/roleMiddleware");
const projectController = require("../../controllers/projectController");

// Project routes
router.post("/project", projectController.createProject);
router.get("/projects", verifyToken, projectController.getAllProjects);
router.get(
  "/projects/:projectId",
  verifyToken,
  projectController.getProjectById
);
router.put(
  "/projects/:projectId",
  verifyToken,
  projectController.updateProject
);

// Sample routes
router.get(
  "/projects/:projectId/samples",
  verifyToken,
  projectController.getSamplesByProject
);
router.post(
  "/samples/:sampleId/request-analysis",
  verifyToken,
  projectController.requestSampleAnalysis
);

// Analysis and reporting routes


module.exports = router;
