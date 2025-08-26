const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const { authenticateJWT, isAdmin } = require("../middleware/auth");

// Public: get menu items
router.get("/", menuController.getAllMenuItems);

// Admin routes
router.post("/", authenticateJWT, isAdmin, menuController.createMenuItem);
router.put("/:id", authenticateJWT, isAdmin, menuController.updateMenuItem);
router.delete("/:id", authenticateJWT, isAdmin, menuController.deleteMenuItem);

module.exports = router;
