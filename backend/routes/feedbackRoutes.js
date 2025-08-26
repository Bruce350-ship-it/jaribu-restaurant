const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");
const { authenticateJWT, isAdmin } = require("../middleware/auth");

// Customer submits feedback
router.post("/", authenticateJWT, feedbackController.submitFeedback);
router.get("/:userId", authenticateJWT, feedbackController.checkFirstDelivered);

// Admin views all feedback
router.get("/", authenticateJWT, isAdmin, feedbackController.getAllFeedback);

module.exports = router;
