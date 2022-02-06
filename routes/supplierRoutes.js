const express = require("express");
const router = express.Router();
const {
  addSupplier,
  listOfSupplier,
  deleteSupplier,
  updateSupplier
} = require("../controllers/supplierController");
const { auth } = require("../middlewares/auth");

router.post("/api/addSupplier", auth, addSupplier);
router.get("/api/allSuppliers", listOfSupplier);
router.delete("/api/deleteSupplier/:id", deleteSupplier);
router.patch("/api/updateSupplier/:id",updateSupplier );

module.exports = router;
