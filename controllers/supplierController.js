const express = require("express");
const Supplier = require("../models/Supplier");

// Adding Supplier
const addSupplier = async (req, res) => {
  try {
    if (!req.body.supplier_name) {
      res
        .status(400)
        .send({ status: 0, message: "Please enter supplier name" });
    } else if (!req.body.supplier_contact) {
      res
        .status(400)
        .send({ status: 0, message: "Please enter supplier contact" });
    } else if (!req.body.supplier_email) {
      res
        .status(400)
        .send({ status: 0, message: "Please enter supplier email" });
    } else if (!req.body.supplier_category) {
      res
        .status(400)
        .send({ status: 0, message: "Please enter supplier category" });
    } else if (!req.body.account_title) {
      res
        .status(400)
        .send({ status: 0, message: "Please enter supplier account title" });
    } else if (!req.body.account_no) {
      res
        .status(400)
        .send({ status: 0, message: "Please enter supplier account number" });
    } else if (!req.body.supplier_date) {
      res.status(400).send({ status: 0, message: "Please enter date" });
    } else if (!req.body.created_by) {
      res.status(400).send({ status: 0, message: "Please enter created by" });
    }
    const supplier =new Supplier({
      supplier_name: req.body.supplier_name,
      supplier_contact: req.body.supplier_contact,
      contact_person: req.user.employe_name,
      supplier_email: req.body.supplier_email,
      supplier_category: req.body.supplier_category,
      account_title: req.body.account_title,
      account_no: req.body.account_no,
      supplier_date: req.body.supplier_date,
      created_by: req.user._id,
      user_id: req.user._id
  
    });
    const supplierFind = await Supplier.findOne({
      supplier_email: req.body.supplier_email,
    });
    if (supplierFind) {
      return res.status(400).send({ status: 0, message: "Use another Email" });
    } else {
      const newSupplier = await supplier.save();
      if (newSupplier) {
        return res
          .status(201)
          .send({ status: 1, message: "Success", data: newSupplier });
      }
    }
  } catch (e) {
    res.send(e.message);
  }
};

// FETCHING ALL SUPPLIER
const listOfSupplier = async (req, res) => {
  try {
    const allSuppliers = await Supplier.find({})
      .select("supplier_name contact_person")
      .populate("created_by", "user_name employe_name");
    res.status(200).send({
      status: 1,
      message: "List of All Suppliers",
      count: allSuppliers.length,
      data: allSuppliers,
    });
  } catch (e) {
    res.send(e.message);
  }
};

// DELETE THE SUPPLIER

const deleteSupplier = async (req, res) => {
  try {
    const deletedId = req.params.id;
    const supplier = await Supplier.findOneAndDelete({ _id: deletedId });
    if (!supplier) {
      return res
        .status(400)
        .send({ status: 0, message: "Supplier not available" });
    } else {
      res.status(200).send({
        status: 1,
        message: "Deleted Successful",
        deleteData: supplier,
      });
    }
  } catch (e) {
    res.send(e.message);
  }
};

// UPDATE THE SUPPLIER
// const updateSupplier = async (req, res) => {
//   const updates = Object.keys(req.body);
//   const allowupdate = [
//     "supplier_name",
//     "supplier_contact",
//     "contact_person",
//     "supplier_category",
//     "account_title",
//     "account_no",
//     "supplier_date",
//   ];
//   const inValidField = updates.every((update) => allowupdate.includes(update));
//   if (!inValidField) {
//     return res.status(400).send({ status: 0, message: "Incorrect Fields" });
//   }
//   try {
//     const updateId = req.params.id;
//     const supplier = await Supplier.findOne({ _id: updateId });
//     if (!supplier) {
//       res.status(404).send({ status: 0, message: "Supplier not Found" });
//     } else {
//       updates.forEach((update) => (supplier[update] = req.body[update]));
//     await supplier.save()
//     }
//     res
//       .status(200)
//       .send({ status: 1, message: "Update Successfull", data: supplier });
//   } catch (e) {
//     res.send(e.message);
//   }
// };

const updateSupplier = async (req, res) => {
  const updateId = req.params.id;
  try {
    const supplier = await Supplier.findOneAndUpdate(
      { _id: updateId },
      {
        supplier_name: req.body.supplier_name,
        supplier_contact: req.body.supplier_contact,
        contact_person: req.body.contact_person,
        supplier_category: req.body.supplier_category,
        account_title: req.body.account_title,
        account_no: req.body.account_no,
        supplier_date: req.body.supplier_date,
      }
    );
    if (!supplier) {
      res.status(404).send({ status: 0, message: "Supplier not Found" });
    } else {
      res.status(200).send({
        status: 1,
        message: "Update Successful",
        updatedData: supplier,
      });
    }
  } catch (e) {
    res.send(e.message);
  }
};
module.exports = {
  addSupplier,
  listOfSupplier,
  deleteSupplier,
  updateSupplier,
};
