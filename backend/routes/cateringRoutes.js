const express = require("express");
const router = express.Router();
const cateringController = require("../controllers/cateringController");
const { authenticateJWT, isAdmin } = require("../middleware/auth");

// Customer creates a request
router.post("/", authenticateJWT, cateringController.createRequest);

// Get requests: Admin gets all, customer gets own
router.get("/", authenticateJWT, cateringController.getRequests);

// Admin updates status
router.put("/:id/status", authenticateJWT, isAdmin, cateringController.updateStatus);

module.exports = router;
