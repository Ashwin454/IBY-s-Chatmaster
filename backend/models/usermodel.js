const mongoose=require("mongoose");
const crypto=require("crypto");

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        minLength:[8, "Enter at least 8 characters"]
    },
    is_verified: {type: Boolean, default: false},
    pic: {type: String, required: true, default: "https://via.placeholder.com/150/000000/FFFFFF/?text=Profile"},
    resetPasswordToken:String,
    resetPasswordExpire: Date,
},
{
    timestamps:true
})
userSchema.methods.getresetpass=function(){
    const resetToken=crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire=new Date(Date.now()+15*60*1000);
    return resetToken;
}
module.exports = mongoose.model("User",userSchema );