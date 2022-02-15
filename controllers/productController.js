const {
  Product,
  WorkShop,
  newAnalysis,
  NewAnalysis,
  ProductRequest,
} = require("../models/ProductModel");
const mongoose = require("mongoose");

// Here Add Prodcut
const newProduct = async (req, res) => {
  try {
    if (!req.body.vin_number) {
      return res
        .status(400)
        .send({ status: 0, message: "vin_number field is required" });
    } else if (!req.body.stock_ro) {
      res
        .status(400)
        .send({ status: 0, message: "stock_ro field is required" });
    } else {
      const product = new Product(req.body);

      const existsProduct = await Product.findOne({
        vin_number: product.vin_number,
      });
      if (existsProduct) {
        if (req.file == "") {
          fs.unlinkSync(req.file.path);
        }
        return res
          .status(400)
          .send({ status: 0, message: "This vin number already exists!" });
      } else {
        if (req.file) {
          product.product_images = req.file.path;
        }
        const saveProduct = await product.save();
        if (saveProduct) {
          console.log(saveProduct);

          return res.status(200).send({
            status: 1,
            message: "Record Saved Successfully.",
            data: saveProduct,
          });
        }
      }
    }
  } catch (e) {
    return res.status(400).send(e);
  }
};

// // add new analysis
// const addNewAnalysis = async (req, res) => {
//   try {
//     // const vin = req.params.vin
//     const newAnalysis = new NewAnalysis({
//       vin_number: req.product.vin_number,
//       date: req.body.date,
//       parts: req.body.parts,
//       created_by:req.body.created_by,
//       comment:req.body.comment,
//       stock_ro:req.product.stock_ro
//     });
//     const findNewAnalysis = await NewAnalysis.findOne({
//       vin_number: req.body.vin_number,
//     });
//     if (findNewAnalysis) {
//       return res
//         .status(404)
//         .send({ status: 0, message: "use another vin number" });
//     } else {
//       const newdata = await newAnalysis.save();
//       if (newdata) {
//        return res
//           .status(200)
//           .send({ status: 1, message: "Successfull", data: newdata });
//       }
//     }
//   } catch (e) {
//     return res.status(400).send(e);
//   }
// };

// GIVE DROPDOWN OPTIONS
const dropDownVin = async (req, res) => {
  try {
    const getAllVins = await Product.find({});
    if (!getAllVins) {
      res.status(404).send({ status: 0, message: "There is no vin products" });
    } else {
      res
        .status(200)
        .send({ status: 1, message: "All vins", data: getAllVins });
    }
  } catch (error) {
    return res.status(400).send(e);
  }
};
// ADDING NEW ANALYSIS
const addNewAnalysis = async (req, res) => {
  try {
    const newAnalysis = new NewAnalysis({
      vin_number: req.body.vin_number,
      date: req.body.date,
      parts: req.body.parts,
      created_by: req.body.created_by,
      comment: req.body.comment,
      stock_ro: req.body.stock_ro,
    });
    const newdata = await newAnalysis.save();
    if (newdata) {
      return res
        .status(200)
        .send({ status: 1, message: "Successfull", data: newdata });
    }
  } catch (e) {
    return res.status(400).send(e);
  }
};

// LIST OF ANALYSIS
const analysisList = async (req, res) => {
  try {
    const listOfAnalysis = await NewAnalysis.find({});
    if (!listOfAnalysis) {
      return res.status(404).send({ status: 0, message: "List is Empty" });
    } else {
      return res.status(200).send({
        status: 1,
        message: "List of Analysis",
        count: listOfAnalysis.length,
        data: listOfAnalysis,
      });
    }
  } catch (e) {
    return res.status(400).send(e);
  }
};
// PRODUCT REQUEST
const productRequest = async (req, res) => {
  try {
    const analysisProduct = await NewAnalysis.findById({
      _id: req.body.analysis_id,
    });
    
    if (!analysisProduct) {
      return res.status(404).send({ status: 0, message: "Wrong analysis Id" });
    } else {
      const addProduct = await ProductRequest({
        vin_number: analysisProduct.vin_number,
        stock_ro: analysisProduct.stock_ro,
        pr_no: Math.floor(100000 + Math.random() * 900000),
        parts: analysisProduct.parts,
      });

      const newProductReq = await addProduct.save();
      return res
        .status(201)
        .send({ status: 1, message: "Successful", data: newProductReq });
    }
  } catch (e) {
    return res.status(400).send(e);
  }
};
// LIST OF PRODUCT REQUEST
const listOFProductRequest = async (req, res) => {
  try {
    const listofPQ = await ProductRequest.find({});
    if (!listofPQ) {
      return res.status(404).send({ status: 0, message: "List is Empty" });
    } else {
      return res.status(200).send({
        status: 1,
        message: "List of PQ",
        count: listofPQ.length,
        data: listofPQ,
      });
    }
  } catch (e) {
    return res.status(400).send(e);
  }
};
// List of PRoduct
const productListBy = async (req, res) => {
  try {
    const prod = await Product.findOne({ _id: req.params.product_id });
    //  .populate('created_by')
    if (prod) {
      return res
        .status(200)
        .send({ status: 1, message: "Success", data: prod });
    } else {
      const prodAll = await Product.find({});
      return res
        .status(200)
        .send({ status: 1, message: "Success", data: prodAll });
    }
  } catch (error) {
    res.send(error.message);
  }
};

// Here Add workshop hours
const workShopHours = async (req, res) => {
  try {
    if (!req.body.user_id) {
      return res
        .status(400)
        .send({ status: 0, message: "Employee id field is required" });
    } else if (!req.body.product_id) {
      res.status(400).send({ status: 0, message: "Vin ID field is required" });
    } else if (!req.body.date) {
      res.status(400).send({ status: 0, message: "Date field is required" });
    } else if (!req.body.hours) {
      res.status(400).send({ status: 0, message: "Hours field is required" });
    } else {
      const product = new WorkShop(req.body);
      product.created_by = req.body.user_id;

      const newHours = await product.save();
      if (newHours) {
        return res
          .status(200)
          .send({ status: 1, message: "Success", data: newHours });
      }
    }
  } catch (e) {
    return res.status(400).send(e);
  }
};

// List of PRoduct
const workshoopListBy = async (req, res) => {
  try {
    const prod = await WorkShop.findOne({ _id: req.params.workshop_id });
    if (prod) {
      return res
        .status(200)
        .send({ status: 1, message: "Success", data: prod });
    } else {
      const prodAll = await WorkShop.find({});
      return res
        .status(200)
        .send({ status: 1, message: "Success", data: prodAll });
    }
  } catch (error) {
    res.send(error.message);
  }
};

module.exports = {
  newProduct,
  productListBy,
  workShopHours,
  workshoopListBy,
  addNewAnalysis,
  analysisList,
  dropDownVin,
  productRequest,
  listOFProductRequest,
};
