const mongoose = require("mongoose");

const supplierSchema = mongoose.Schema(
  {
    supplier_name: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    supplier_contact: {
      type: Number,
      required: false,
      trim: true,
    },
    contact_person: {
      type: String,
      required: false,
      trim: true,
    },
    supplier_email: {
      type: String,
      required: false,
      trim: true,
    },
    supplier_category: {
      type: String,
      enum: ["new", "used", "both", "company agent", "company outlet"],
      default: "new",
    },
    account_title: {
      type: String,
      required: false,
      trim: true,
    },
    account_no: {
      type: Number,
      required: false,
      trim: true,
    },
    supplier_date: {
      type: String,
      required: false,
      trim: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    }
    
  },
  {
    timestamps: true,
  }
);

const Supplier = mongoose.model("Supplier", supplierSchema);

module.exports = Supplier;
