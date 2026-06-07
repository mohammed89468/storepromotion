const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const OTPSmobilechema = mongoose.Schema(
    {
        mobile:{
            type:String,
            required:true,
            trim:true,
            match: [/^[6-9]\d{9}$/, "Invalid mobile number"]
        },
        otp:{
            type:String,
            required:true,
        },
        expiresAt:{
            type:Date,
            required:true,
            expires: 0
        },
        attempts:{
            type:Number,
            default:0
        },
         maxAttempts:{
            type:Number,
            default:3
        }

        
    }
);
OTPSmobilechema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
OTPSmobilechema.index({ mobile: 1 });
OTPSmobilechema.pre('save',async function() {
    try{
    if(!this.isModified('otp')) return;

    this.otp = await bcrypt.hash(this.otp.toString(),10);
   
    }catch(err)
    {
   console.log(err);
    }
});

OTPSmobilechema.methods.verifyOTP = async function (inputotp) {
try{
if(this.expiresAt < new Date())
{
    return {success:false,message:"Otp Experied"}
}
if(this.attempts >= this.maxAttempts)
{
  return {success:false,message:"Too Many Attempts"}  
}
const match = await bcrypt.compare(String(inputotp),this.otp);
if(!match)
{
this.attempts+=1;
await this.save();
return {success:false,message:"Wrong OTP please try again"}
}

return {success:true, message: "OTP Verified" }
}
catch(err)
{
return {success:false,message:err.message};
}
}

module.exports = mongoose.model('otpmobilemodel',OTPSmobilechema);