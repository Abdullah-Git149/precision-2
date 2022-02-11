const mongoose = require("mongoose");

// Product Schema
const productSchema = new mongoose.Schema(
  {
    vin_number: {
      type: String,
      default: null,
      trim: true,
    },
    model: {
      type: String,
      default: null,
      trim: true,
    },
    make: {
      type: String,
      default: null,
      trim: true,
    },
    color: {
      type: String,
      default: null,
      trim: true,
    },
    stock_ro: {
      type: String,
      default: null,
      trim: true,
    },
    product_images: {
      type: String,
      default: null,
      trim: true,
    },
    comment: {
      type: String,
      default: null,
      trim: true,
    },
    date: {
      type: String,
      default: null,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    is_blocked: {
      type: Number,
      default: 0,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
const newAnalysis = new mongoose.Schema({
  vin_number: {
    type: String,
    default: null,
  },
  stock_ro: {
    type: String,
    default: null,
  },
  date: {
    type: String,
    default: null,
  },
  parts: [
    {
      part_name: { type: String, required: true },
      part_model_num: { type: String, required: true },
    },
  ],
  comment: {
    type: String,
    default: null,
    trim: true,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
});
// Product Images Schema
const workShopSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    emp_name: {
      type: String,
      default: null,
      trim: true,
    },
    date: {
      type: String,
      default: null,
      trim: true,
    },
    hours: {
      type: String,
      default: null,
      trim: true,
    },
    comment: {
      type: String,
      default: null,
      trim: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    is_blocked: {
      type: Number,
      default: 0,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Product Images Schema
const userProductSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    is_blocked: {
      type: Number,
      default: 0,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
const WorkShop = mongoose.model("WorkShop", workShopSchema);
const UserProduct = mongoose.model("UserProduct", userProductSchema);
const NewAnalysis = mongoose.model("NewAnalysis", newAnalysis);


module.exports = { Product, WorkShop, UserProduct, NewAnalysis };
