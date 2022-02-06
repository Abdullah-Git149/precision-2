const bcrypt = require("bcrypt");
const { sendEmail } = require("../config/utils");
const { User, Category, Notification, Admin } = require("../models/User");
const {
  HelpAndFeedBack,
  HelpAndFeedBackImages,
} = require("../models/HelpAndFeedbackModel");
const { Content } = require("../models/ContentModel");
const fs = require("fs");
const mongoose = require("mongoose");
const { WorkShop } = require("../models/ProductModel");
const ObjectId = mongoose.Types.ObjectId;

// Add hospital
const addCategory = async (req, res) => {
  try {
    const hospital = new Category(req.body);

    const newHospital = await hospital.save();
    if (newHospital) {
      res
        .status(200)
        .send({ status: 1, message: "Success", data: newHospital });
    }
  } catch (e) {
    res.status(400).send(e);
  }
};

const categoryList = async (req, res) => {
  try {
    const getList = await Category.find({});
    if (getList) {
      res.status(200).send({ status: 1, message: "Success", data: getList });
    }
  } catch (e) {
    res.status(400).send(e);
  }
};

// User sign up
const signUp = async (req, res) => {
  const user = new User(req.body);
  try {
    if (!req.body.user_name) {
      res
        .status(400)
        .send({ status: 0, message: "User Name field is required" });
    } else if (!req.body.user_password) {
      res
        .status(400)
        .send({ status: 0, message: "User Password field is required" });
    } else if (!req.body.user_type) {
      res
        .status(400)
        .send({ status: 0, message: "User  Type field is required" });
    } else {
      const userFind = await User.findOne({ employe_id: req.body.employe_id });
      if (userFind) {
        return res
          .status(200)
          .send({ status: 0, message: "This employe id already exist." });
      } else {
        const token = await user.generateAuthToken();
        const newUser = await user.save();
        if (newUser) {
          return res.status(200).send({
            status: 1,
            message: "User Sign Up Successfully.",
            data: newUser,
          });
        }
      }
    }
  } catch (err) {
   
  }
};

// Here user login
const userLogin = async (req, res) => {
  try {
    if (!req.body.user_name) {
      res
        .status(400)
        .send({ status: 0, message: "User Email field is required" });
    } else if (!req.body.user_password) {
      res
        .status(400)
        .send({ status: 0, message: "Password field is required" });
    } else {
      const user = await User.findOne({ user_name: req.body.user_name });
      if (!user) {
        return res
          .status(400)
          .send({ status: 0, message: "User Name not found!" });
      }
      const isMatch = await bcrypt.compare(
        req.body.user_password,
        user.user_password
      );
      if (!isMatch) {
        return res
          .status(400)
          .send({ status: 0, message: "Password not match!" });
      }

      await user.generateAuthToken();
      return res
        .status(200)
        .send({ status: 1, message: "Login Successful.", data: user });
    }
  } catch (e) {
    return res.status(400).send(e);
  }
};
// Finding specific man with id
const userWithWorkHour = async (req, res) => {
  try {
    if (!req.body.user_id) {
      res.status(400).send({ status: 0, message: "Please enter user id" });
    } else {
      const totalNoOfRent = await WorkShop.find({
        user_id: req.user._id,
      }).populate("user_id", "user_name");
      if (!totalNoOfRent) {
        res
          .status(404)
          .send({ status: 0, message: "User dont have any workshop" });
      } else {
        res
          .status(200)
          .send({
            status: 1,
            count: totalNoOfRent.length,
            message: "Succesfull",
            data: totalNoOfRent,
          });
      }
    }
  } catch (err) {
    return res.status(400).send(err);
  }
};

const user_verification = async (req, res) => {
  try {
    if (!req.body.user_verification_code) {
      return res
        .status(400)
        .send({ status: 0, message: "Verification Code field is required" });
    } else {
      const userFind = await User.findOne({
        _id: req.body.user_id,
        user_verification_code: req.body.user_verification_code,
      });
      if (userFind) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: req.body.user_id },
          { user_is_verified: 1, user_verification_code: null }
        );
        if (updatedUser) {
          const token = await userFind.generateAuthToken();
          const updatedUserFind = await User.findOne({ _id: req.body.user_id });
          const findit = await User.findOne({
            _id: updatedUserFind._id,
          }).populate("company_id");
          return res.status(200).send({
            status: 1,
            message: "Successfully verified account",
            data: findit,
          });
        }
      } else {
        return res
          .status(400)
          .send({ status: 0, message: `This Verification Code is Invalid!` });
      }
    }
  } catch (e) {
    res.status(400).send(e);
  }
};

const resendCode = async (req, res) => {
  try {
    if (!req.body.user_id) {
      return res
        .status(400)
        .send({ status: 0, message: "User ID field is required" });
    } else {
      const userFind = await User.findOne({ _id: req.body.user_id });
      //  if(userFind.user_is_verified == 1){
      //     return res.status(200).send({status: 1, message: 'User Already Verified.',data:userFind});
      //  }
      //  else{
      if (userFind) {
        const verificationCode = Math.floor(100000 + Math.random() * 900000);
        await User.findOneAndUpdate(
          { _id: req.body.user_id },
          { user_verification_code: verificationCode }
        );
        sendEmail(userFind.user_email, verificationCode);
        return res
          .status(200)
          .send({ status: 1, message: "Verification Code Successfully Send." });
      } else {
        return res.status(400).send({ status: 0, message: "User Not Found." });
      }
      //}
    }
  } catch (e) {
    res.status(400).send(e);
  }
};

const completeProfile = async (req, res) => {
  //  console.log(req.body);
  //  return;

  const userUpdate = new User(req.body);
  try {
    // if(!req.body.user_id){
    //     res.status(400).send({status: 0, message: 'User ID field is required'});
    // }
    // else{

    // console.log(req.file);
    // return

    // if(req.file){
    //     user_image        = req.file.path
    //  }
    if (req.file) {
      const updateUser = await User.findOneAndUpdate(
        { _id: req.body.user_id },
        {
          user_fname: userUpdate.user_fname,
          user_lname: userUpdate.user_lname,
          company_id: userUpdate.company_id,

          user_image: req.file ? req.file.path : req.user.user_image,
          user_is_profile_complete: 1,
        },
        { new: true }
      );
      const findit = await User.findOne({ _id: updateUser._id }).populate(
        "company_id"
      );
      if (findit) {
        res.status(200).send({
          status: 1,
          message: "Profile Update Successfully.",
          data: findit,
        });
      } else {
        res.status(400).send({ status: 0, message: "Something Went Wrong." });
      }
    } else {
      const updateUser = await User.findOneAndUpdate(
        { _id: req.body.user_id },
        {
          user_fname: userUpdate.user_fname,
          user_lname: userUpdate.user_lname,
          company_id: userUpdate.company_id,

          user_is_profile_complete: 1,
        },
        { new: true }
      );
      const findit = await User.findOne({ _id: updateUser._id }).populate(
        "company_id"
      );
      if (findit) {
        res.status(200).send({
          status: 1,
          message: "Profile Update Successfully.",
          data: findit,
        });
      } else {
        res.status(400).send({ status: 0, message: "Something Went Wrong." });
      }
    }

    //}
  } catch (e) {
    return res.status(400).send(e.message);
  }
};

// Here user logout
const userLogout = async (req, res) => {
  try {
    if (!req.body.user_id) {
      res.status(400).send({ status: 0, message: "User ID field is required" });
    } else if (!req.headers.authorization) {
      res
        .status(400)
        .send({ status: 0, message: "Authentication Field is required" });
    } else {
      const updateUser = await User.findOneAndUpdate(
        { _id: req.body.user_id },
        {
          user_authentication: null,
          user_device_type: null,
          user_device_token: null,
        }
      );
      res.status(200).send({ status: 1, message: "User logout Successfully." });
    }
  } catch (e) {
    res.status(400).send(e);
  }
};

// Here user Forget Password
const userForgotPassword = async (req, res) => {
  try {
    if (!req.body.user_email) {
      res
        .status(400)
        .send({ status: 0, message: "User Email field is required" });
    } else {
      const userFind = await User.findOne({ user_email: req.body.user_email });
      if (userFind) {
        const verificationCode = Math.floor(100000 + Math.random() * 900000);
        const updatedUser = await User.findOneAndUpdate(
          { _id: userFind._id },
          { user_verification_code: verificationCode },
          { new: true }
        );
        const findit = await User.findOne({ _id: updatedUser._id }).populate(
          "company_id"
        );
        sendEmail(userFind.user_email, verificationCode);
        res.status(200).send({
          status: 1,
          message: "Verification Code Send please check your email.",
          data: findit,
        });
      } else {
        res.status(400).send({ status: 0, message: "User Email not found!" });
      }
    }
  } catch (e) {
    res.status(400).send(e);
  }
};

// Here user update password
const userPasswordUpdate = async (req, res) => {
  try {
    if (!req.body.new_password) {
      return res
        .status(400)
        .send({ status: 0, message: "User New Password Field is required" });
    } else {
      const userFind = await User.findOne({ user_email: req.body.user_email });

      if (userFind) {
        const newPassword = await bcrypt.hash(req.body.new_password, 8);
        const updateUser = await User.findOneAndUpdate(
          { _id: userFind._id },
          {
            user_password: newPassword,
            user_verification_code: null,
          },
          { new: true }
        );
        const findit = await User.findOne({ _id: updateUser._id }).populate(
          "company_id"
        );
        return res.status(200).send({
          status: 1,
          message: "New Password Update Successfully.",
          data: findit,
        });
      } else {
        return res.status(400).send({
          status: 0,
          message: "User Email and Verification code not match!",
        });
      }
    }
  } catch (e) {
    return res.status(400).send(e);
  }
};

// Here user update password
const changePassword = async (req, res) => {
  try {
    if (!req.body.old_password) {
      return res.send({ status: 0, message: "Old Password field is required" });
    } else if (!req.body.new_password) {
      return res.send({ status: 0, message: "New Password field is required" });
    } else {
      const userFind = await User.findOne({ _id: req.body.user_id });
      if (userFind) {
        const oldPassword = await bcrypt.compare(
          req.body.old_password,
          userFind.user_password
        );

        if (userFind && oldPassword == true) {
          const newPassword = await bcrypt.hash(req.body.new_password, 8);
          await User.findOneAndUpdate(
            { _id: req.body.user_id },
            { user_password: newPassword }
          );
          return res.send({
            status: 1,
            message: "New password Update Successfully.",
          });
        } else {
          return res.send({ status: 0, message: "Password Not Match" });
        }
      } else {
        return res.send({ status: 0, message: "Something Went Wrong." });
      }
    }
  } catch (e) {
    res.status(400).send(e);
  }
};

// User social login
const socialLogin = async (req, res) => {
  try {
    if (!req.body.user_social_token) {
      res
        .status(400)
        .send({ status: 0, message: "User Social Token field is required" });
    } else if (!req.body.user_social_type) {
      res
        .status(400)
        .send({ status: 0, message: "User Social Type field is required" });
    } else if (!req.body.user_device_type) {
      res
        .status(400)
        .send({ status: 0, message: "User Device Type field is required" });
    } else if (!req.body.user_device_token) {
      res
        .status(400)
        .send({ status: 0, message: "User Device Token field is required" });
    } else {
      const checkUser = await User.findOne({
        user_social_token: req.body.user_social_token,
      });

      if (!checkUser) {
        const newRecord = new User();
        // if(req.file){
        //     newRecord.user_image    = req.file.path
        //  }
        newRecord.user_image = req.body.user_image;
        (newRecord.user_social_token = req.body.user_social_token),
          (newRecord.user_social_type = req.body.user_social_type),
          (newRecord.user_device_type = req.body.user_device_type),
          (newRecord.user_device_token = req.body.user_device_token);
        (newRecord.user_email = req.body.user_email),
          (newRecord.user_is_verified = 1);

        await newRecord.generateAuthToken();
        const saveLogin = await newRecord.save();
        const findit = await User.findOne({ _id: saveLogin._id }).populate(
          "company_id"
        );
        res
          .status(200)
          .send({ status: 1, message: "Login Successfully", data: findit });
      } else {
        let userEmailObj = {};
        if (req.body.user_email) {
          userEmailObj["user_email"] = req.body.user_email;
        }
        const token = await checkUser.generateAuthToken();
        let updateObject = {
          ...userEmailObj,
          user_social_type: req.body.user_social_type,
          user_device_type: req.body.user_device_type,
          user_device_token: req.body.user_device_token,
          user_is_verified: 1,
          user_authentication: token,
        };
        const upatedRecord = await User.findOneAndUpdate(
          { _id: checkUser._id },
          updateObject,
          { new: true }
        );
        const findit = await User.findOne({ _id: upatedRecord._id }).populate(
          "company_id"
        );
        res
          .status(200)
          .send({ status: 1, message: "Login Successfully", data: findit });
      }
    }
  } catch (e) {
    console.log(e, "error");
    res.status(400).send(e);
  }
};

// Here get Content by type
const content = async (req, res) => {
  try {
    if (!req.body.content_type) {
      return res
        .status(400)
        .send({ status: 0, message: "Content field is required" });
    } else {
      const contentFind = await Content.findOne({
        content_type: req.body.content_type,
      });
      if (contentFind) {
        return res.status(200).send({ status: 1, data: contentFind });
      } else {
        return res
          .status(400)
          .send({ status: 0, message: "Content type not found!" });
      }
    }
  } catch (e) {
    return res.status(400).send(e);
  }
};

// Here user Notification
const notification = async (req, res) => {
  try {
    const userNoti = await Notification.find({ user_id: req.body.user_id });
    if (userNoti.length > 0) {
      return res
        .status(200)
        .send({ status: 1, message: "Success", data: userNoti });
    } else {
      return res.status(400).send({ status: 1, message: "No Record Found!" });
    }
  } catch (e) {
    res.status(400).send(e);
  }
};

// Get Company
const getAllCompany = async (req, res) => {
  try {
    const getCompany = await Admin.find({ isAdmin: false });
    if (getCompany) {
      return res
        .status(200)
        .send({ status: 1, message: "Success", data: getCompany });
    }
  } catch (e) {
    return res.status(400).send(e);
  }
};

const helpFeedBack = async (req, res) => {
  try {
    if (!req.body.subject) {
      return res.send({ status: 0, message: "Subject field is required" });
    } else if (!req.body.description) {
      return res.send({ status: 0, message: "Description field is required" });
    } else {
      const help = new HelpAndFeedBack(req.body);
      const helpFeedBack = await help.save(async function (err, data) {
        try {
          var i = "";
          for (i = 0; i < req.files.length; i++) {
            const hfImages = new HelpAndFeedBackImages();

            hfImages.hf_id = data._id;
            hfImages.hf_images = req.files[i].path;

            await hfImages.save();
          }
        } catch (e) {
          res.status(400).send(e);
        }
        res.send({
          status: 1,
          message: "Record Saved Successfully.",
          data: helpFeedBack,
        });
      });
    }
  } catch (e) {
    res.status(400).send(e);
  }
};

// Get Help List
const helpFeedList = async (req, res) => {
  try {
    const getList = await HelpAndFeedBack.find({
      user_id: req.body.user_id,
    }).sort({ _id: -1 });
    if (getList.length > 0) {
      return res
        .status(200)
        .send({ status: 1, message: "Success", data: getList });
    } else {
      return res.status(400).send({ status: 0, message: "No Record Found!" });
    }
  } catch (e) {
    return res.status(400).send(e);
  }
};

const msg = async (req, res) => {
  res.status(200).send({ message: "Welcome to Smart Offer Application!" });
};

module.exports = {
  addCategory,
  categoryList,
  signUp,
  user_verification,
  resendCode,
  completeProfile,
  userLogin,
  userLogout,
  userForgotPassword,
  userPasswordUpdate,
  socialLogin,
  content,
  changePassword,
  notification,
  getAllCompany,
  helpFeedBack,
  helpFeedList,
  msg,
  userWithWorkHour,
};
