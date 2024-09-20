  const mongoose= require("mongoose");
  
  const sendEmailVerificationSchema= new mongoose.Schema({
    userId: {type:mongoose.Schema.Types.ObjectId, ref:'User',
        required: true
    },
    otp: {type: String, required: true},
    createdAt: {type:Date, default: Date.now, expires: '15m'}
  });

const sendEmailVerificationModel = mongoose.model("EmailVerification", sendEmailVerificationSchema);
module.exports=sendEmailVerificationModel;