const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const { signup, signin, isSignedIn } = require("../controllers/auth");

router.post(
  "/signup",
  check("name").isLength({ min: 3 }).withMessage("Enter valid name"),
  check("password").isLength({ min: 5 }).withMessage("Enter valid password"),
  check("email").isEmail().withMessage("Enter valid email"),
  signup
);

router.post(
  "/signin",
  check("password").isLength({ min: 5 }).withMessage("Enter valid password"),
  check("email").isEmail().withMessage("Enter valid email"),
  signin
);
router.get("/testRoute", isSignedIn, (req, res) => {
  res.send("A protected route");
});
module.exports = router;
