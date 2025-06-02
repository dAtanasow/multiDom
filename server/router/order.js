const express = require("express");
const router = express.Router();
const { createOrder, getAllOrders, getOrderById, updateOrderStatus } = require("../controllers/order");
const { isAdmin } = require("../middlewares/isAdmin");
const { auth } = require("../utils");
const { checkoutValidator } = require("../validators/checkout");
const { validate } = require("../middlewares/validate");

router.post("/", auth(false), checkoutValidator, validate, createOrder);
router.get("/", auth(), isAdmin, getAllOrders);
router.get("/:id", auth(), isAdmin, getOrderById);
router.put("/:id/status", auth(), isAdmin, updateOrderStatus);

module.exports = router;