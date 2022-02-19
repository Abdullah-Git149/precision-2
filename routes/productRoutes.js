const express = require('express');
const router = express.Router();
const {newProduct,purchaseOrder,deliveryStatus,gettingOnePO,listOfPO,listOFProductRequest,productListBy,productRequest,dropDownVin ,analysisList,workShopHours,workshoopListBy,addNewAnalysis} = require('../controllers/productController');
const {auth,vinAuth} = require('../middlewares/auth');
const {upload} = require('../config/utils');


// Routes
router.post('/api/newProduct',upload.single('product_images'), newProduct);
router.get('/api/productListBy/:product_id?', productListBy);
router.get('/api/workshoopListBy/:workshop_id?', workshoopListBy);
router.post('/api/workShopHours', workShopHours);
router.post('/api/addNewAnalysis',addNewAnalysis);
router.get('/api/analysisList',analysisList);
router.get('/api/dropDownVin',dropDownVin);
// router.post('/api/addProductReq',productRequest);
// router.get('/api/listOfPQ',listOFProductRequest);
router.post('/api/poDevelopment',purchaseOrder);
router.get('/api/listOfPO',listOfPO);
router.post('/api/gettingOnePO',gettingOnePO);
router.patch('/api/deliveryStatus',deliveryStatus);
module.exports = router;