const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateJWT, isAdmin } = require("../middleware/auth");

router.get("/me", authenticateJWT, userController.getProfile);
router.get("/", authenticateJWT, isAdmin, userController.getAllUsers); // Optional admin route

module.exports = router;
