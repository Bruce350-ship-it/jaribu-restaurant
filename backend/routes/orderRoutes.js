const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authenticateJWT, isAdmin } = require("../middleware/auth");

// Customer routes
router.post("/", authenticateJWT, orderController.createOrder);
router.get("/", authenticateJWT, orderController.getMyOrders);
router.get("/:id", authenticateJWT, orderController.getOrderById);

// Admin routes
router.get("/admin/all", authenticateJWT, isAdmin, orderController.getAllOrders);
router.put("/:id/status", authenticateJWT, isAdmin, orderController.updateOrderStatus);

module.exports = router;
