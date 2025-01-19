const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const researcherController = require("../controllers/researcherController");

// Project routes
router.post("/projects", verifyToken, researcherController.createProject);
router.get("/projects", verifyToken, researcherController.getAllProjects);
router.get(
  "/projects/:projectId",
  verifyToken,
  researcherController.getProjectById
);
router.put(
  "/projects/:projectId",
  verifyToken,
  researcherController.updateProject
);

// Sample routes
router.get(
  "/projects/:projectId/samples",
  verifyToken,
  researcherController.getSamplesByProject
);
router.post(
  "/samples/:sampleId/request-analysis",
  verifyToken,
  researcherController.requestSampleAnalysis
);

// Analysis and reporting routes
router.post(
  "/projects/:projectId/reports",
  verifyToken,
  researcherController.createReport
);
router.get(
  "/projects/:projectId/reports",
  verifyToken,
  researcherController.getProjectReports
);
router.get(
  "/samples/:sampleId/history",
  verifyToken,
  researcherController.getSampleAnalysisHistory
);

module.exports = router;
