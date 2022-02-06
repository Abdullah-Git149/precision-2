const express = require('express');
const router = express.Router();
const {signUp,user_verification,resendCode,completeProfile,userLogin,userLogout,userForgotPassword,
    userPasswordUpdate,socialLogin,changePassword,content,notification,getAllCompany,helpFeedBack,helpFeedList,msg, userWithWorkHour} = require('../controllers/userController');
    const {loginVlidation,signIn,userList,getAllBranches,
        branchEdit,deletBranche,deletAgency,isAuthenticatedUser,adminApproval,BranchVlidation,BranchAgency,getDashboardData,passwordChange,pushNoti} = require('../controllers/admin/adminController');
      const {getContent,updateContent,updateContentTc} = require('../controllers/admin/contentController');

const {auth} = require('../middlewares/auth');
const {upload} = require('../config/utils');


// Routes

//router.post('/api/addCategory', addCategory);
//router.post('/api/categoryList', categoryList);
router.post('/api/userWithWorkHour',auth,userWithWorkHour)
router.post('/api/signup', signUp);
router.post('/api/user_verification', user_verification);
router.post('/api/re_send_code', resendCode);
router.post('/api/complete_profile',upload.single('user_image'), completeProfile);
router.post('/api/user_login', userLogin);
router.post('/api/logout',auth, userLogout);
router.post('/api/forgot_password', userForgotPassword);
router.post('/api/update_password', userPasswordUpdate);
router.post('/api/changePassword',auth, changePassword);
router.post('/api/social_login', socialLogin);
router.post('/api/content', content);
router.post('/api/notification',auth, notification);
router.post('/api/getAllCompany',auth, getAllCompany);
router.post('/api/helpFeedBack',upload.array('hf_images[]'),auth, helpFeedBack);
router.post('/api/helpFeedList',auth, helpFeedList);

// Here is Admin panel Routes
router.post('/api/signIn',loginVlidation, signIn);
router.get('/api/userList', userList);
router.get('/api/getAllBranches', getAllBranches);

router.post('/api/BranchAgency',BranchVlidation, BranchAgency);
//router.get('/api/branchEditData/:branch_id', branchEdit);
//router.post('/api/deletBranche/:branch_id', deletBranche);
router.post('/api/deletAgency/:agency_id', deletAgency);
router.get('/api/adminApproval/:user_id', adminApproval);

router.get('/api/content/:content_type?', getContent);
router.post('/api/updateContent', updateContent);
router.post('/api/updateContentTc', updateContentTc);
router.get('/api/dashboard', getDashboardData);
router.post('/api/passwordChange', passwordChange);
// verify token
router.get("/api/verify-token", isAuthenticatedUser, (req, res) => {
    res.status(200).send({ status: "success", message: "token is valid" });
  });

 //router.get('/',msg);

module.exports = router;