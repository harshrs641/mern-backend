const express = require("express");
const router = express.Router();

const { getUserById, getUser, getAllUsers, updateUser, userPurchaseList } = require("../controllers/user");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");

router.get("/getUserDetail",isSignedIn, getUserById, isAuthenticated, getUser);
router.patch("/user", isSignedIn,getUserById, isAuthenticated, updateUser);
router.get("/orders/user",isSignedIn, getUserById, isAuthenticated, userPurchaseList);
router.get("/user", getAllUsers);
module.exports = router;
