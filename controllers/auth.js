const User = require("../models/user");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

exports.signup = (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty) return res.status(422).json({ message: error });

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({ err: "Not able to save user" });
    } else {
      res.json({
        name: user.name,
        email: user.email,
        id: user._id,
      });
    }
  });
};

exports.signin = (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({ message: error });
  }
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(404).json({ message: "User email does not exists" });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({ message: "Password does not match" });
    }
    //create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    //put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    const { email, _id, name, role } = user;
    return res.json({ token, user: { _id, email, name, role } });
  });
};
exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Signed out" });
};

//protected middlewares
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  algorithms: ["HS256"],
  userProperty: "auth",
});

//custom middlewares

exports.isAuthenticated = (req, res, next) => {
  let checker = req.auth ;
  if (!checker) {
    return res.status(401).json({ message: "Acccess denied" });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0)
    return res.status(401).json({ message: "Not Admin" });
  next();
};
