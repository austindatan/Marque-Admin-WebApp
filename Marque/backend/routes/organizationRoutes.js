const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

const {
  getOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization
} = require("../controllers/organizationController");

// same endpoints, no changes
router.get("/", getOrganizations);
router.post("/", upload.single("logo"), createOrganization);
router.put("/:id", upload.single("logo"), updateOrganization);
router.delete("/:id", deleteOrganization);

module.exports = router;