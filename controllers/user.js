const User = require("../models/user");
const Order = require("../models/order");

exports.getUserById = (req, res, next,) => {
  User.findById(req.auth._id).exec((err, user) => {
    if (err || !user)
      return res.status(404).json({ message: "User not found" });

    req.profile = user;
    next();

  });
};
exports.getUser = (req, res) => {
  let id = req.auth._id;
  User.findById(id).exec((err, user) => {
    if (err || !user)
      return res.status(404).json({ message: "User not found" });

    req.profile = user;
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;

    return res.json(req.profile);
  });
};
exports.getAllUsers = (req, res) => {
  User.find((err, users) => {
    if (err || !users) return res.json({ message: err });
    users.forEach((user) => {
      user.salt = undefined;
      user.encry_password = undefined;
    });
    return res.json({ users: users });
  });
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.params.userId },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err || !user) {
        return res.status(400).json({ message: "User not found" });
      }
      user.salt = undefined;
      user.encry_password = undefined;

      return res.json(user);
    }
  );
};
exports.userPurchaseList = (req, res) => {
  Order.find({ user: req.params.userId })
    .populate("User", "_id name email")
    .exec((err, order) => {
      if (err || !order) {
        return res.status(400).json({ message: "Order not found" });
      }
      return res.json(order);
    });
};

exports.pushOrderInPurchaseList = (req, res, next) => {
  let purchases = [];
  req.body.order.products.forEach((product) => {
    purchases.push({
      _id: product._id,
      name: product.name,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id,
    });
  });

  User.findOneAndUpdate(
    { _id: req.params.userId },
    { $push: { purchases: purchases } },
    { new: true },
    (err, purchase) => {
      if (err || !purchase)
        return res.json({ message: "Unable to save purchase list" });
      next();
    }
  );
};
