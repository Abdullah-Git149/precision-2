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
// NEW ANALYSIS
const newAnalysis = new mongoose.Schema({
  vin_number: {
    type: String,
    default: null,
  },
  stock_ro: {
    type: String,
    default: null,
  },
  pr_no: {
    type: Number,
    trim: true,
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
// PRODUCT REQUEST
// const productRequest = new mongoose.Schema(
//   {
//     vin_number: {
//       type: String,
//       default: null,
//     },
//     stock_ro: {
//       type: String,
//       default: null,
//     },

//     pr_no: {
//       type: Number,
//       default: 0,
//     },
//     parts: [
//       {
//         part_name: { type: String, required: true },
//         part_model_num: { type: String, required: true },
//       },
//     ],
//   },
//   {
//     timestamps: true,
//   }
// );
// PURCHASE ORDER
const purchaseOrder = new mongoose.Schema({
  analysis_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "NewAnalysis",
  },
  po_no: {
    type: Number,
    default: 0,
  },
  expected_date: {
    type: String,
    trim: true,
    required: true,
  },
  parts: [
    {
      part_name: { type: String, required: true },
      part_model_num: { type: String, required: true },
      part_supplier: { type: String, required: false },
      part_amount: { type: String, required: false },
      delivery_status: {
        type: String,
        enum: ["recieved", "notrecieved"],
        default: "notrecieved",
      },
    },
  ],
  total_amount: {
    type: Number,
    default: 0,
  },
  delivery_status: {
    type: String,
    enum: ["fullydelivered", "partiallydelivered", "notdelivered"],
    default: "notdelivered",
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
// const ProductRequest = mongoose.model("ProductRequest", productRequest);
const PurchaseOrder = mongoose.model("PurchaseOrder", purchaseOrder);

module.exports = {
  Product,
  WorkShop,
  UserProduct,
  NewAnalysis,
  // ProductRequest,
  PurchaseOrder,
};
