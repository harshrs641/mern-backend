const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { sortBy } = require("lodash");

exports.getProductById = (req, res, next, id) => {
  // console.log(id);
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err )
        return res.status(404).json({ message: "Product not found" });
      req.product = product;
      // console.log(req.product);

      next();
    });
};

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) return res.status(400).json({ message: "Problem with image" });

    //destructure the fields
    const { name, description, price, category, stock } = fields;
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({ message: "Please incluse all fields" });
    }

    let product = new Product(fields);

    //handle file
    if (file.photo) {
      if (file.photo.size > 3 * 1024 * 1024) {
        return res.json({ message: "file size too bug" });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    //save to db
    product.save((err, prod) => {
      if (err) return res.status(400).json({ message: "unable to save" });
      res.json(prod);
    });
  });
};

exports.getProductDetail = (req, res) => {
  // console.log(req.product);
  return res.json(req.product);
};

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) return res.status(400).json({ message: "Problem with image" });
    //updating product
    let product = req.product;
    product = _.extend(product, fields);

    //handle file
    if (file.photo) {
      if (file.photo.size > 3 * 1024 * 1024) {
        return res.json({ message: "file size too bug" });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    //save to db
    product.save((err, prod) => {
      if (err) return res.status(400).json({ message: "unable to update" });
      res.json(prod);
    });
  });
};

exports.getAllProducts = (req, res) => {
  let limit = parseInt(req.query.limit) || 8;
  let soryBy = req.query.sortBy || "createdAt";
  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err) return res.status(404).json({ message: "No product found" });
      return res.json(products);
    });
};

exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });
  Product.bulkWrite(myOperations, {}, (err, products) => {
    if (err) return res.status(400).json({ message: err });
    next();
  });
};
