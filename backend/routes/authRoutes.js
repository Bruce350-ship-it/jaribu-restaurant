const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const orderController = require("../controllers/orderController");
const { authenticateJWT, isAdmin } = require("../middleware/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/admin/orders", authenticateJWT, isAdmin, orderController.getAllOrders);

module.exports = router;
