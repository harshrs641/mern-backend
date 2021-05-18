const express = require("express");
const router = express.Router();

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const {
  getProductById,
  createProduct,
  getProductDetail,
  photo,
  getAllProducts,
} = require("../controllers/product");
const { getUserById } = require("../controllers/user");

router.param("productId", getProductById);
router.post(
  "/product/create",
  isSignedIn,
  isAuthenticated,
  getUserById,
  isAdmin,
  createProduct
);
router.get("/product/:productId", getProductDetail);
router.get("/product/photo/:productId", photo);
router.get("/product", getAllProducts);

module.exports = router;
