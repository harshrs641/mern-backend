const { Order } = require("../models/order");

exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, order) => {
      if (err || !order)
        return res.status(404).json({ message: "No Order found" });
      req.order = order;
      next();
    });
};

exports.createOrder = (req, res) => {
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  order.save((err, order) => {
    if (err) return res.status(400).json({ mesaage: err });
    return res.json(order);
  });
};

exports.getAllOrders = (req, res) => {
  Order.find()
    .populate("user", "name _id")
    .exec((err, orders) => {
      if (err || !orders)
        return res.status(404).json({ message: "No Order found" });
      return res.json(orders);
    });
};

exports.getOrderStatus = (req, res) => {
  res.json(Order.schema.path("status").enumValues);
};

exports.updateStatus = (req, res) => {
  Order.updateOne(
    { _id: req.order.orderId },
    { $set: { status: req.body.status } },
    (err, order) => {
      if (err) return res.status(404).json({ message: "No Order found" });
      return res.json(order);
    }
  );
};
