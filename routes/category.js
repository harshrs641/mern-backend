const express = require("express");
const router = express.Router();

const {
  createCategory,
  getCategoryById,
  getCategoryDetail,
  getAllCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");
// const {} = require("../controllers/user");

router.param("categoryId", getCategoryById);
router.param("userId", getUserById);

router.post(
  "/category/create",
  isSignedIn,
  getUserById,
  isAuthenticated,
  isAdmin,
  createCategory
);

router.get("/category/:categoryId", getCategoryDetail);
router.get("/categories/", getAllCategory);
router.patch(
  "/category/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateCategory
);

router.delete(
  "category/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteCategory
);

module.exports = router;
