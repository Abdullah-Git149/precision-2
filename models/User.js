const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');
const jwt       = require('jsonwebtoken');

const userSchema = mongoose.Schema({   
    user_name:{
        type: String,
        required: false,
        trim: true,
        default: null
     },
    employe_name:{
        type: String,
        required: false,
        trim: true,
        default: null
     },
     employe_id:{
        type: String,
        required: false,
        trim: true,
        default: null
     },
     user_email:{
        type: String,
        required: false,
        trim: true,
        default: null
     },
     user_password:{
        type: String,
        required: false,
        trim: true,
        default: null
     },
    is_blocked:{
        type: Number,
        default: 1,
        trim: true,
    },
    user_authentication:{           
        type: String,
        required: false,
        default: null,
        },  
    user_image:{           
        type: String,
        required: false,
        default: null,
        }, 
    user_type: {
        type: String,
        enum : ['admin','purchaser','analyst','mechanic','painter','body','worker','detailer'],
        default: 'purchaser'
    },        
}, {
    timestamps: true
});


// Category Schema
const categorySchema  = new mongoose.Schema({       
    category_name: {
       type: String,
       default: null,
       trim: true,
    },
    category_image:{           
        type: String,
        required: false,
        default: null,
        },      
    is_blocked:{
     type: Number,
     default: 1,
     trim: true,
    },
}, {
   timestamps: true
});


// User Notify Category Schema
const notificationSchema  = new mongoose.Schema({
    
    user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user'
    },          
    category_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Category'
    },                 
    message: {
        type: String,
        default: null,
        trim: true,
     },       
     title: {
      type: String,
      default: null,
      trim: true,
      },
    is_read: {
        type: Number,
        default: 1        
    },            
    is_blocked:{
     type: Number,
     default: 1,
     trim: true,
    },
}, {
   timestamps: true
});

// Here is admin Schema
const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        minlength: 3
    },
    email: {
       type: String,
       require: true,
       
   },
   user_image:{           
    type: String,
    required: false,
    default: null,
    }, 
   password: {
       type: String,
       require: true,
       minlength: 6
   }, 
   isAdmin:{
       type: Boolean,
       require: false,
       default: false
   },
   is_blocked:{
    type: Number,
    default: 0,
    trim: true,
   },
 },
   {timestamps:true}
 );

// Here Hiding some data
userSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();

    delete userObject.user_password;
   // delete userObject.user_authentication;
    
    return userObject;
}

// Here generate Auth Token
userSchema.methods.generateAuthToken = async function(){
   
    const user = this;  
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET);
    user.user_authentication = token;    
    await user.save();
    return token;
}

// Hash Password save before  saving
userSchema.pre('save', async function (next) {
    const user = this;
    if(user.isModified('user_password')){
        user.user_password = await bcrypt.hash(user.user_password, 8);
    }
    next();
});



const User              = mongoose.model('user', userSchema);
const Category          = mongoose.model('Category', categorySchema);
const Notification      = mongoose.model('Notification', notificationSchema);
const Admin             = mongoose.model('Admin', adminSchema);

module.exports = {User, Category, Notification, Admin};