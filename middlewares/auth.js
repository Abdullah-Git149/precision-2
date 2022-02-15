const { User } = require("../models/User");
const { Product } = require("../models/ProductModel");
const fs = require("fs");

const setHeader = (token) => {
  const setToken = token.substring(7);
  return setToken;
};

const auth = async (req, res, next) => {
  if (!req.body.user_id) {
    res.status(400).send({ status: 0, message: "User ID field is required!" });
  } else if (!req.headers.authorization) {
    res
      .status(400)
      .send({ status: 0, message: "Authentication Field is required" });
  } else {
    const userFind = await User.findOne({
      _id: req.body.user_id,
      user_authentication: setHeader(req.headers.authorization),
    });
    if (userFind) {
      req.user = userFind;
      next();
    } else {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).send({ status: 0, message: "Wrong Auth Token!" });
    }
  }
};
const vinAuth = async (req, res, next) => {
  try {
    if (!req.body.pro_id) {
      res
        .status(400)
        .send({ status: 0, message: "Product ID field is required!" });
    } else {
      const findProduct = await Product.find({ _id: req.body.pro_id });
      if (findProduct) {
        req.product = findProduct;
        console.log(findProduct)
        next();
      } else {
        return res
          .status(400)
          .send({ status: 0, message: "Wrong Product ID!" });
      }
    }
  } catch (e) {
    return res.status(400).send({ error: e.message });
  }
};

module.exports = { auth, vinAuth };
