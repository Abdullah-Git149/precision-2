const {Product,ProductImages,ProductFeature, ProductQuestion} = require('../../models/ProductModel');
const { body, validationResult, cookie } = require('express-validator');
const { User, Notification } = require('../../models/User');

  // Get All Product list
  const getAllProduct = async (req, res) => {
    try{
         const getAllProduct = await Product.find({is_blocked:0},{title:1,brand:1,price:1});
          if(getAllProduct){          
            return res.status(200).json({getAllProduct});
          }
    }catch(error){        
      res.send(error.message);
    }
  }

  const ProductVlidation = [  
    body('category_id').not().isEmpty().trim().withMessage('Category ID  is required!'),
    body('title').not().isEmpty().trim().withMessage('Title  is required!'),
     
  ]

  // Here Add Prodcut
const addPrdocut = async(req, res) => {
  if(req.body.id == ''){
  try {
    validationResult(req).throw();

   try{
  
           const product = new Product(req.body);                    
          
            const existsProduct = await Product.findOne({title: product.title});                       
             if(existsProduct){
              if(req.file == ''){
                  fs.unlinkSync(req.file.path); 
              }   
               return res.status(400).send({status: 0, message: 'This product name already exists!'});                
             }
             else{            
                    //  const findUsers = await User.find({"userCategory.category_id": req.body.category_id});  
                     
                    //  findUsers.forEach(async data => {
                    //         const noti = new Notification({
                    //           user_id: data._id,
                    //           category_id: req.body.category_id,
                    //           title: req.body.title,
                    //           message: `New Product Added ${req.body.title}`
                    //         })
                    //          await noti.save();                            
                    //   });
                    //     const barCode = Math.floor(100000 + Math.random() * 900000);
                    //     product.barcode = barCode; 
                       product.product_images =  req.file.path;
                      const saveProduct =   product.save();
                        return res.status(200).json({msg: 'Data Saved Successfully!', data:saveProduct});
                      //     try{
                      //     var i = '';                                              
                      //     for(i=0; i<(req.files.length); i++){
                      //         const pdImages = new ProductImages();
                      
                      //         pdImages.product_id = data._id;
                      //         pdImages.product_images =  req.files[i].path;
                          
                      //         await pdImages.save();
                          
                      //     }
                      //     //return res.send({saveProduct, data:{ _id: data._id}});
                      //     return res.status(200).json({msg: 'Data Saved Successfully!', data:{ _id: data._id}});
                          
                      // } catch(e){
                      //     return res.status(400).send(e);
                      // }                                                
                         
                  
                  }
          
      
   } catch(e){
      return res.status(400).send(e);
   }

  }catch(err){        
    return res.status(400).json({error: err.mapped()});
 }
  }

 else{          
    const updateRecord =  await Product.updateOne({ _id: req.body.id},
      {title: req.body.title,category_id:req.body.category_id,description:req.body.description});
    if(updateRecord){
    return res.status(200).json({msg: 'Update Successfully!'});
    }
}  

}

// Here is product Details
const productDetail = async (req, res) => {
  try{           
      
       //const productDetail = await Product.findOne({_id: req.params.product_id}).populate('category_id');         
       const productDetail = await Product.findOne({_id: req.params.product_id})
         .populate([
           {
            path: 'category_id',
            model: 'Category'
           },
           {
             path: 'rating',
             populate:{
               path:'user_id'
             }
           }

         ]);         
        if(productDetail){            
            return res.status(200).json({productDetail});
        }
  }catch(error){        
    return res.send(error.message);
  }
}


const productFeatures = async (req, res) => {
  try {
     
    if (!req.body.product_id) {
      return res
        .status(400)
        .send({ status: 0, message: "Product ID field is required" });
    } else if (!req.body.feature_title) {
      return res.status(400).send({
        status: 0,
        message: "Product Feature Title field is required",
      });
    } else if (!req.body.feature_detail) {
      return res.status(400).send({
        status: 0,
        message: "Product Feature Details field is required",
      });
    } else if (!req.body.feature_price) {
      return res.status(400).send({
        status: 0,
        message: "Product Feature Price field is required",
      });
    } else {
      const existsProduct = await Product.findOne({ _id: req.body.product_id });
      if (existsProduct) {
        const existsProductFea = await ProductFeature.findOne({
          feature_title: req.body.feature_title,
        });
        if (existsProductFea) {
          return res
            .status(400)
            .send({ status: 0, message: "Title Already exists!" });
        } else {
          const feaProduct = new ProductFeature(req.body);
          const newFeature = await feaProduct.save();
          if (newFeature) {
            return res
              .status(200)
              .send({ status: 1, message: "Success", data: newFeature });
          }
        }
      } else {
        return res
          .status(400)
          .send({ status: 0, message: "Product Not Found!" });
      }
    }
  } catch (e) {
    return res.status(400).send(e);
  }
};


// Delete Product
const deleteProduct = async (req, res) => {
  try{         
       const delProduct = await Product.findByIdAndUpdate({_id: req.params.product_id}, {is_blocked:1});
        if(delProduct){          
          return res.status(200).json({msg: 'Delete Successfully!'});
        }
  }catch(error){        
    res.send(error.message);
  }
}

const productEdit = async (req, res) => {
  try{    
           
       const productEdit = await Product.findOne({_id: req.params.product_id});         
        if(productEdit){            
            return res.status(200).json({productEdit});
        }
  }catch(error){        
    return res.send(error.message);
  }
}

// Add question
const addQuestion = async (req, res) => {
  try{   
          const addquestion = await ProductQuestion.create(req.body);
        if(addquestion){          
          return res.status(200).json({msg: 'Question Add Successfully!'});
        }
  }catch(error){        
    res.send(error.message);
  }
}

// Get Survey list By id
const surveyList = async (req, res) => {
  try{    
           
       //const productEdit = await Product.findOne({_id: req.params.product_id});         
       const productEdit = await Product.findOne({_id: '61adad4a635bfc0e94b8e616'})
         .populate('product_answers.user_id product_answers.question_id')         
        if(productEdit){            
            return res.status(200).json({productEdit});
        }
  }catch(error){        
    return res.send(error.message);
  }
}
  
module.exports = {    
  getAllProduct,
  addPrdocut,
  ProductVlidation,
  productFeatures,
  deleteProduct,
  productEdit,
  productDetail,
  addQuestion,
  surveyList 
}