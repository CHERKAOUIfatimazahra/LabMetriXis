const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middleware/authMiddleware");
const { isChercheur } = require("../../middleware/roleMiddleware");
const projectController = require("../../controllers/projectController");
const userController = require("../../controllers/userController");
const searchController = require("../../controllers/searchController");
const statistiqueController = require("../../controllers/statistiqueController");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// get users and user by id
router.get(
  "/available-team-members",
  verifyToken,
  userController.getAvailableTeamMembers
);

router.get(
  "/available-technicians",
  verifyToken,
  userController.getAvailableTechnicians
);

// Project routes
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
  upload.single("protocolFile"),
  projectController.addSampleToProject
);

router.get(
  "/projects/:projectId/samples",
  verifyToken,
  projectController.getSamplesByProject
);

// Search and statistics routes
router.get(
  "/projects/search",
  verifyToken,
  isChercheur,
  searchController.searchProjects
);
router.get(
  "/projects/statistics",
  verifyToken,
  isChercheur,
  statistiqueController.getProjectStatistics
);

// Get all projects (now paginated through search)
router.get(
  "/projects",
  verifyToken,
  isChercheur,
  searchController.searchProjects
);

module.exports = router;
