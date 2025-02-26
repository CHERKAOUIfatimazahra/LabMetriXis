const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middleware/authMiddleware");
const { isChercheur } = require("../../middleware/roleMiddleware");
const projectController = require("../../controllers/projectController");
const userController = require("../../controllers/userController");

// Project routes
router.get(
  "/available-team-members",
  verifyToken,
  userController.getAvailableTeamMembers
);
router.post(
  "/project",
  verifyToken,
  isChercheur,
  projectController.createProject
);

// Sample routes
router.post(
  "/projects/:projectId/samples",
  verifyToken,
  isChercheur,
  projectController.addSampleToProject
);

router.get(
  "/projects/:projectId/samples",
  verifyToken,
  projectController.getSamplesByProject
);











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
