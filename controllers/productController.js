const {Product, WorkShop} = require('../models/ProductModel');
const mongoose = require('mongoose');

// Here Add Prodcut
const newProduct = async(req, res) => { 
  try{
   
      if(!req.body.vin_number){
          return res.status(400).send({status: 0, message: 'vin_number field is required'});
      }
      else if (!req.body.stock_ro){
        res.status(400).send({status: 0, message: 'stock_ro field is required'});
      } 
       else{                   
           const product = new Product(req.body);                    
          
            const existsProduct = await Product.findOne({vin_number: product.vin_number});                       
             if(existsProduct){
              if(req.file == ''){
                  fs.unlinkSync(req.file.path); 
              }   
               return res.status(400).send({status: 0, message: 'This vin number already exists!'});                
             }
             else{                                          
                  if(req.file){
                    product.product_images        = req.file.path
                  }              
                const saveProduct =  product.save(); 
                 if(saveProduct){
                  return res.status(200).send({status: 1, message: 'Record Saved Successfully.'});               
                 }                                  
                
                }
          
      }
   } catch(e){
      return res.status(400).send(e);
   }
}

// List of PRoduct
const productListBy = async (req, res) => {
  try{   

    const prod = await Product.findOne({_id: req.params.product_id})
            //  .populate('created_by')             
      if(prod){          
        return res.status(200).send({status: 1,message: 'Success', data:prod});
      }
      else{
        const prodAll = await Product.find({});
        return res.status(200).send({status: 1,message: 'Success',data:prodAll});
      }
          
  }catch(error){        
    res.send(error.message);
  }
}

// Here Add workshop hours
const workShopHours = async(req, res) => {
  try{
   
      if(!req.body.user_id){
          return res.status(400).send({status: 0, message: 'Employee id field is required'});
      }
      else if (!req.body.product_id){
        res.status(400).send({status: 0, message: 'Vin ID field is required'});
      } 
      else if (!req.body.date){
        res.status(400).send({status: 0, message: 'Date field is required'});
      } 
      else if (!req.body.hours){
        res.status(400).send({status: 0, message: 'Hours field is required'});
      } 
       else{                   
           const product = new WorkShop(req.body);        
                product.created_by = req.body.user_id;
          
               const newHours = await product.save();
               if(newHours){
                return res.status(200).send({status: 1,message: 'Success',data:newHours});
               }
          
      }
   } catch(e){
      return res.status(400).send(e);
   }
}

// List of PRoduct
const workshoopListBy = async (req, res) => {
  try{   

    const prod = await WorkShop.findOne({_id: req.params.workshop_id});
      if(prod){          
        return res.status(200).send({status: 1,message: 'Success', data:prod});
      }
      else{
        const prodAll = await WorkShop.find({});
        return res.status(200).send({status: 1,message: 'Success',data:prodAll});
      }
          
  }catch(error){        
    res.send(error.message);
  }
}

module.exports = {  
  newProduct,
  productListBy, 
  workShopHours,
  workshoopListBy

}