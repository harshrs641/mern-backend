const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err || !category)
      return res.status(404).json({ message: "Category not found" });

    req.category = category;
  });
  next();
};

exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err || !category)
      return res.status(401).json({ message: "Not able to save" });

    return res.json({ category });
  });
};

exports.getCategoryDetail = (req, res) => {
  return res.json(req.category);
};

exports.getAllCategory = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err || !categories)
      return res.status(401).json({ message: "Not able to save" });
    return res.json({ categories });
  });
};

exports.updateCategory = (req, res) => {
  const category = req.category;
  category.name = req.body.name;
  category.save((err, updateCategory) => {
    if (err || !updateCategory)
      return res.status(401).json({ message: "Not able to update" });

    return res.json(updateCategory);
  });
};

exports.deleteCategory = (req, res) => {
  const category = req.category;

  category.remove((err, removedCategory) => {
    if (err || !removedCategory)
      return res.status(401).json({ message: "Not able to delete" });

    return res.json(removedCategory);
  });
};
