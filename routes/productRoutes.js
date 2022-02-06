const express = require('express');
const router = express.Router();
const {newProduct,productListBy,workShopHours,workshoopListBy} = require('../controllers/productController');
const {auth} = require('../middlewares/auth');
const {upload} = require('../config/utils');


// Routes
router.post('/api/newProduct',upload.single('product_images'), newProduct);
router.get('/api/productListBy/:product_id?', productListBy);
router.get('/api/workshoopListBy/:workshop_id?', workshoopListBy);
router.post('/api/workShopHours', workShopHours);


module.exports = router;