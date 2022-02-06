const mongoose = require('mongoose');

const help_and_feedbackSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
   }, 
    subject: {
         type: String,
         required: false,
         trim: true
     },
     description: {
         type: String,
         required: false,
         trim: true
     }
}, {
    timestamps: true
});

// Create Model Help and Feedback Images
const help_and_feedback_images = new mongoose.Schema({
   hf_id: {
       type: mongoose.Schema.Types.ObjectId,
       required: true,
       ref: 'HelpAndFeedBack'
   },
   hf_images: {
       type: String,
       required: false,
       trim: true
   }
}, {
    timestamps: true
}); 

const HelpAndFeedBack = mongoose.model('HelpAndFeedBack', help_and_feedbackSchema);
const HelpAndFeedBackImages = mongoose.model('HelpAndFeedBackImages', help_and_feedback_images);

module.exports = {HelpAndFeedBack, HelpAndFeedBackImages};