const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

const connect = require("./db/db");
require("dotenv").config();

const userRouters = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const supplierRoutes = require("./routes/supplierRoutes");

const PORT = process.env.PORT || 3000;
connect();

app.use(express.json());

app.use("/", userRouters);
app.use("/", productRoutes);
app.use("/", supplierRoutes);
//app.use('/', eventRouters);
app.use("/uploads", express.static("uploads"));
// app.use(express.static(path.resolve('../alaska/admin/build/')));

// app.get('*', function (req, res) {
//     res.sendFile(path.resolve('../alaska/admin/build/index.html'));
//     //res.sendFile(path.resolve(__dirname, 'admin', 'build', 'index.html'));
//   });

app.listen(PORT, () => {
  console.log("Server up on Port ", PORT);
});
