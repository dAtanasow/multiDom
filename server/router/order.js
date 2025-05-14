const express = require("express");
const router = express.Router();
const { createOrder, getAllOrders, getOrderById, updateOrderStatus } = require("../controllers/order");
const { isAdmin } = require("../utils/isAdmin");
const { auth } = require("../utils");

router.post("/", auth(), isAdmin, createOrder);
router.get("/", auth(), isAdmin, getAllOrders);
router.get("/:id", auth(), isAdmin, getOrderById);
router.put("/:id/status", auth(), isAdmin, updateOrderStatus);

module.exports = router;