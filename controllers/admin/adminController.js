const bcrypt = require('bcrypt');
const { sendEmailViaPassword, createToken } = require('../../config/utils');
const {Admin,User,HospitalBranch, Category} = require('../../models/User');
const { body, validationResult, cookie } = require('express-validator');
const jwt = require('jsonwebtoken')


const FCM = require('fcm-node');
const { Product } = require('../../models/ProductModel');
const serverKey = 'AAAABRBNBtY:APA91bHR_is6D5WVTKcSXsSqGUcOS-VnL0HvLlr0ymHmGR3rHhxL-_FEaalvMVX0RQGJ3uQUXHds8t2rqlIJxVeDlIYaA7tqtZaKkNuSg7uowQ_yY9Tnp6d9s8hyIGU4GCKvdaovvPqU'; //put your server key here
const fcm = new FCM(serverKey);


// verify token
const isAuthenticatedUser = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(400).send("authorization token missing");
  }
  var token = req.headers.authorization.split(" ")[1];
  try {
    var decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded) {
      const { user } = decoded;
      Admin.findOne({ _id: user._id })
        .then((usr) => {
          //console.log(usr);
          req.user = usr;
          next();
        })
        .catch((err) => {
          console.log(err, "error");
          return res.status(400).send(err);
        });
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// Login Validation
const loginVlidation = [  
    body('email').not().isEmpty().trim().withMessage('Email is required!'),
    body('password').not().isEmpty().trim().withMessage('Password is required!')
  ]


  // User login 
  const signIn = async (req, res) => {      
      // console.log(req.body);
      // return;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
    return res.status(400).json({error: errors.array()});
    }
    const {email, password} = req.body;
    try {
    const user = await Admin.findOne({email});        
        if(user){
            const matched = await bcrypt.compare(password, user.password);               
            if(matched){
               
              //const userPermission = await RolePermission.find({designation_id: user.designation_id});  
                //await Admin.updateOne({ email: user.email }, { is_online: 1 });
                const token = createToken(user);
                const userJson = user.toJSON();
                delete userJson["password"];
                return res.status(200).json({msg: 'Login successfully', token, userJson});
            }else{
            return res.status(404).json({error: [{msg: 'Password not match!'}]});
            }
        }else{
        return res.status(404).json({error: [{msg: 'Email not found!'}]});
        }
    } catch (error) {
    return res.status(500).json({errors:error});
    }
}

// Get User list
const userList = async (req, res) => {
    try{

            const users = await User.find({is_blocked:1},{user_fname:1,user_email:1});            
            return res.status(200).send(users);          
         
    }catch(error){        
      res.send(error.message);
    }
}

// Admin Approval
const adminApproval = async (req, res) => {
  try{         
       const adminApp = await User.findByIdAndUpdate({_id: req.params.user_id}, {is_blocked:0});
        if(adminApp){          
          return res.status(200).json({msg: 'User Delete Successfully!'});
        }
  }catch(error){        
    res.send(error.message);
  }
}

// Agency Edit
const categoryEdit = async (req, res) => {
    try{    
     
         const categoryEdit = await Category.findOne({_id: req.params.category_id});         
          if(categoryEdit){            
              return res.status(200).json({categoryEdit});
          }
    }catch(error){        
      return res.send(error.message);
    }
  }

  // Delete Category
  const deletCategory = async (req, res) => {
    try{         
         const delBranch = await Category.findByIdAndUpdate({_id: req.params.category_id}, {is_blocked:0});
          if(delBranch){          
            return res.status(200).json({msg: 'Delete Successfully!'});
          }
    }catch(error){        
      res.send(error.message);
    }
  }
  
  // Branch Edit
  const branchEdit = async (req, res) => {
    try{    
             
         const branchEdit = await HospitalBranch.findOne({_id: req.params.branch_id});         
          if(branchEdit){            
              return res.status(200).json({branchEdit});
          }
    }catch(error){        
      return res.send(error.message);
    }
  }
  
  
  // Get All Event list
  const getAllCategory = async (req, res) => {
    try{
         const categoryList = await Category.find({is_blocked: 1}, {category_name:1});
          if(categoryList){          
            return res.status(200).json({categoryList});
          }
    }catch(error){        
      return res.send(error.message);
    }
  }
  
  
  const CategoryVlidation = [  
    body('category_name').not().isEmpty().trim().withMessage('Category Name is required!'),     
  ]
  
  // Here Save Category API
const AddCategory = async (req, res) => {
 
    if(req.body.id == ''){
        try {
          validationResult(req).throw();

    try{
      
        if(req.body.id == ''){
        const newUser = new Category();

        if(req.file){
          newUser.category_image       = req.file.path
         }
        
         newUser.category_name           = req.body.category_name,                  
         await newUser.save();              
         return res.status(200).json({msg: 'Saved Successfully!'});
        }
          
    }catch(error){        
        return res.status(500).json({errors: error});
    }

    }catch(err){        
        return res.status(400).json({error: err.mapped()});
     }
    }

     else{

      if(req.file){
        category_image       = req.file.path; 
      }
      else{
        category_image = req.body.category_image;
      }
          
        const updateRecord =  await Category.updateOne({ _id: req.body.id},
          {category_name: req.body.category_name,category_image : category_image});
        if(updateRecord){
         return res.status(200).json({msg: 'Update Successfully!'});
        }
      }   
  }

  // Get All Event list
  const getAllBranches = async (req, res) => {
    try{
         const branchesList = await HospitalBranch.find({is_blocked: 0}, {branch_name:1,hospital_id:1});
          if(branchesList){          
            return res.status(200).json({branchesList});
          }
    }catch(error){        
      res.send(error.message);
    }
  }


  const BranchVlidation = [  
    body('hospital_id').not().isEmpty().trim().withMessage('Agency Name  is required!'),
    body('branch_name').not().isEmpty().trim().withMessage('Branch Name is required!'),
        
  ]
  
  // Here Save Banch
const BranchAgency = async (req, res) => {
 
    if(req.body.id == ''){
        try {
          validationResult(req).throw();

    try{
      
        if(req.body.id == ''){
        const newUser = new HospitalBranch();
        
         newUser.hospital_id              = req.body.hospital_id,
         newUser.branch_name              = req.body.branch_name,        
         await newUser.save();              
         return res.status(200).json({msg: 'Saved Successfully!'});
        }
          
    }catch(error){        
        return res.status(500).json({errors: error});
    }

    }catch(err){        
        return res.status(400).json({error: err.mapped()});
     }
    }

     else{          
        const updateRecord =  await HospitalBranch.updateOne({ _id: req.body.id},
          {hospital_id: req.body.hospital_id,branch_name:req.body.branch_name});
        if(updateRecord){
         return res.status(200).json({msg: 'Update Successfully!'});
        }
      }   
  }

  

  // Delete Agency
  const deletAgency = async (req, res) => {
    try{         
    
         const delAgency = await Admin.findByIdAndUpdate({_id: req.params.agency_id}, {is_blocked:1});
          if(delAgency){          
             await HospitalBranch.updateMany({hospital_id: req.params.agency_id}, {is_blocked:1});
            return res.status(200).json({msg: 'Delete Successfully!'});
          }
    }catch(error){        
      res.send(error.message);
    }
  }

  // Get Data For Dashbaord
const getDashboardData = async (req, res) => {
  try{
       const nurse = await User.find({is_blocked: 1}).countDocuments();
       const product = await Product.find({is_blocked: 0}).countDocuments();
       const android = await User.find({'user_device_type': 'android'}).countDocuments();
       const ios = await User.find({'user_device_type': 'ios'}).countDocuments();
       
          
        if(nurse){
          return res.status(200).send({nurse,product,android,ios});
        }
  }catch(error){        
    res.send(error.message);
  }
}

// Here is change pasword
const passwordChange = async (req, res) => {
  try{
   
       const checkEmail = await Admin.findOne({'email': req.body.user_email});
           
        if(checkEmail){
          const newPassword = await bcrypt.hash('abc123', 8);                
           await Admin.findOneAndUpdate({_id: checkEmail._id},{
            password: newPassword              
          });
          sendEmailViaPassword(req.body.user_email, 'abc123');  
          return res.status(200).json({msg: 'Email Send successfully'});
        }else{
          return res.status(404).json({error: [{msg: 'Email not found!'}]});
        }
  }catch(error){        
   return res.send(error.message);
  }
}


const pushNoti = async (req, res) => {
  try{


    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
      to: 'd9nRzqPVSrONF7_Sium4dO:APA91bGsf455JLMB5Eh-HfLXPXW4EJCUtQJFl_xYEF0t-p-pD63zyEb9fwIsWWSc1emq8jfwZav8ouGQYvBtChzbndPzUmQWjIJ8GyD6qG8H_YvZMO_5ug5Ne1KM8r7DkEUUljV-Q_58', 
      
      notification: {
          title: 'Testing here', 
          body: 'Testing body' 
      },
      data: {  //you can send only notification or only data(or include both)
        my_key: 'go to here',
        my_another_key: 'my another value'
    }      

  };
  
  fcm.send(message, function(err, response){
      if (err) {
          console.log("Something has gone wrong!");
      } else {
          console.log("Successfully sent with response: ", response);
      }
  });

    return res.status(404).json('faizan here');
       
  }catch(error){        
   return res.send(error.message);
  }
}

module.exports = {    
    loginVlidation,
    signIn,
    userList,  
    categoryEdit,
    deletCategory,
    deletAgency,
    getAllCategory,
    CategoryVlidation,
    AddCategory,
    isAuthenticatedUser,
    getAllBranches,
    BranchVlidation,
    BranchAgency,
    getDashboardData,
    passwordChange,
    pushNoti,
    adminApproval
}