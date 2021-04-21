const express = require("express");
const { isSignedIn, isAdmin } = require("../controllers/auth");
const { getOrderById, createOrder, getAllOrders } = require("../controllers/order");
const { updateStock } = require("../controllers/product");
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");
const router = express.Router();

router.param("orderId", getOrderById);

router.post(
  "/order/create",
  isSignedIn,
  getUserById,
  pushOrderInPurchaseList,
  updateStock,
  createOrder
);
router.get("/order/all", isSignedIn, getUserById, getAllOrders)
router.get("/order/status", isSignedIn, getUserById, getAllOrders)
router.put("/order/status/:orderId", isSignedIn, getUserById, isAdmin, getAllOrders)
module.exports = router;
