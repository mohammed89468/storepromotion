const user = require('../Models/Usermodel');
const otpmobilemodel = require('../Models/OtpMobileModel');
const otpemailmodel = require('../Models/OtpEmailModel');
const refferal = require('../Models/RefferalModel');
const crypto = require("crypto");

const addUser = async (req,res) =>
    {
        try{
        const {username,password,email,mobile} = req.body;
       
        const userfind =  await user.findOne({username:username});
        if(userfind){
            return res.status(200).json({
                message:"user is already exist"
            })
        }
        const newreferalcode = crypto.randomInt(111111,666666);
        var userData = new user({
            username:username,
            password:password,
            email:email,
            mobile:mobile,
            referalcode:newreferalcode
            
        })
       var userStatus = await userData.save();

       const dbdata= await user.find();

     if (userStatus) {
            return res.status(201).json({
                message: "Data Uploaded Successfully.",
                users: dbdata
            });
        }
    } catch (error) {
        // Send the error as an object or a string
        return res.status(500).json({ message: "Data not uploaded", error: error.message });
    }
    }
    const deleteUser = async (req,res) =>
    {
        try{
        const {username} = req.body;
        const deletedata = await user.deleteMany({username:username});
        if(deletedata.deletedCount==0)
        {
            return res.status(200).json({
                message:"no data is there"
            })
        }
        const dbdata = await user.find(); 
        if(deletedata)
        {
            return res.status(201).json({
               message: "Data deleted successfully",
               users: dbdata,
               count:deletedata.deletedCount
            })
        }

        }catch(err)
        {
          return res.status(500).json({
            message: "Server error",
            error: err.message
        });
        }
    }
    const updateUser = async (req,res) => 
    {
         try{
             const {username,password} = req.body;
            if(!username || !password)
            {
                return res.status(400).json({message:"Fill all fields in the form."})
            }
            const updateUser = await user.findByIdAndUpdate(
                req.params.id,
                {username:username,password:password},
                {new:true}
            );
            if(!updateUser){
            return res.status(404).json({message:"Something Went wrong!"});
            }
            else{
           
               return res.status(200).json({message:"Update Sucessfully",data:updateUser});
            }
         }catch(err)
         {
            return res.status(500).json({message:"Error:"+err.message});

         }
    }
   const usernameChange = async (req,res) =>
   {
    try{
        const {username} = req.body.username;
        if(!username)
        {
            return res.status(400).json({message:"Fill the username"});
        }
        const usernameUpdated = await user.findByIdAndUpdate(
            req.params.id,
            {$set:{username:username}},
            {new:true}
        );
        if(!usernameUpdated)
        {
            return res.status(404).json({message:"User not found! "});
        }

    }catch(err)
    {
        return res.status(500).json({message:"Error:"+err.message})
    }


   }
   const getUsers = async (req,res) =>
   {
     try{
        const userdata = await user.find();
        if(!userdata)
        {
            return res.status(404).json({message:"not found"});
        }
        else
        {
            return res.status(200).json({message:"fetch user sucessfully",data:userdata});
        }

     }catch(err)
     {
        return res.status(500).json({message:"Something went wrong"})
     }
   } 
   const getuserbyid = async (req,res) =>
   {
    try
    {
        const userid = req.params.id;

        const userdata = await user.findOne({_id:userid});
         if(!userdata)
         {
            return res.status(404).json({message:"Data Not Found"});
         }
         else{
            return res.status(200).json({message:"User fetch Sucessfully",data:userdata});
         }
    }
    catch(err)
    {
        return res.status(500).json({message:"Something went wrong"})
    }
   }
    const userLogin = async (req,res) =>
   {
    try
    {
        const {username,password} = req.body;
        if(!username)
        {
            return res.status(400).json({message:"Fill the username"});
        }
      const userfind =  await user.findOne({username:username});
      if(!userfind)
      {
        return res.status(200).json({message:"User not found"});
      }
      const passwordverify = await userfind.verifyPassword(password);
      if(!passwordverify)
      {
        return res.status(200).json({message:"Invalid Password"});
      }
      return res.status(201).json({message:"Welcome Back"});
    }
    catch(err)
    {
        return res.status(500).json({message:"Something went wrong"})
    }
   }

   const sendotp = async (req,res) => {
    try{

        const mobile =  req.body.mobile;

        if(!mobile)
        {
            return res.status(404).json({message:"Please enter your mobile number"});

        }
        const findUser = await user.findOne({mobile:mobile});
        const deletemobile = await otpmobilemodel.deleteMany({mobile:mobile});
        if(!findUser)
        {
            return res.status(404).json({message:"User Not Found! Please Register"});
        }
        const otp = crypto.randomInt(111111,999999).toString();

        const newotp = new otpmobilemodel({
            mobile,
            otp,
            expiresAt:new Date(Date.now()+2*60*1000),
      
        });

       const storeotp = await newotp.save();

       if(storeotp){
        return res.status(200).json({message:"OTP Send Sucessfully!",otp:otp,data:storeotp});
       }

    }catch(err)
    {
        console.log(err)
        return res.status(500).json({message:"Something Went Wrong!"});
    }
    
   }

   const verifyotp = async (req,res) =>{
    try{
         const {mobile,otp} =  req.body;

        if(!mobile)
        {
            return res.status(404).json({message:"Please enter your mobile number"});

        }
        const findUser = await user.findOne({mobile:mobile});
         
      
        if(!findUser)
        {
            return res.status(404).json({message:"User Not Found! Please Register"});
        }
        
       const mobileotp = await otpmobilemodel.findOne({ mobile });
        if(!mobileotp)
        {
            return res.status(404).json({message:"Mobile number not found"});
        }
       
       const result = await mobileotp.verifyOTP(otp);
         return res.status(200).json(result);
        

    }catch(err)
    {
        return res.status(500).json({message:"something went wrong",err});
    }

   }
   const sendemailotp = async (req,res) => {
    try{

        const email =  req.body.email;

        if(!email)
        {
            return res.status(404).json({message:"Please enter your mobile number"});

        }
        const findUser = await user.findOne({email:email});
        const deletemobile = await otpemailmodel.deleteMany({email:email});
        if(!findUser)
        {
            return res.status(404).json({message:"User Not Found! Please Register"});
        }
        const otp = crypto.randomInt(111111,999999).toString();

        const newotp = new otpemailmodel({
            mobile,
            otp,
            expiresAt:new Date(Date.now()+2*60*1000),
      
        });

       const storeotp = await newotp.save();

       if(storeotp){
        return res.status(200).json({message:"OTP Send Sucessfully!",otp:otp,data:storeotp});
       }

    }catch(err)
    {
        console.log(err)
        return res.status(500).json({message:"Something Went Wrong!"});
    }
    
   }

   const verifyemailotp = async (req,res) =>{
    try{
         const {email,otp} =  req.body;

        if(!email)
        {
            return res.status(404).json({message:"Please enter your mobile number"});

        }
        const findUser = await user.findOne({mobile:mobile});
         
      
        if(!findUser)
        {
            return res.status(404).json({message:"User Not Found! Please Register"});
        }
        
       const mobileotp = await otpemailmodel.findOne({ mobile });
        if(!mobileotp)
        {
            return res.status(404).json({message:"Mobile number not found"});
        }
       
       const result = await mobileotp.verifyOTP(otp);
         return res.status(200).json(result);
        

    }catch(err)
    {
        return res.status(500).json({message:"something went wrong",err});
    }

   }
  const refferalusers = async (req,res) =>
    {
        try{
        const {username,password,email,mobile,refferalcode} = req.body;
       
        const userfind =  await user.findOne({username:username});
        if(userfind){
            return res.status(200).json({
                message:"user is already exist"
            })
        }

        const oldrefferal  = await user.findOne({refferalcode:refferalcode});
        if(!oldrefferal)
        {
            return res.status(200).json({
                message:"No such refferal are exists"
            })
        }
        const newreferalcode = crypto.randomInt(111111,666666);
        var userData = new user({
            username:username,
            password:password,
            email:email,
            mobile:mobile,
            referalcode:newreferalcode

        })

       var userStatus = await userData.save();

        const refferaladd = new refferal({
            olduserref:oldrefferal._id,
            newuserref:userStatus._id
        });
        refferaladd.save();
       const dbdata= await user.find();

     if (userStatus) {
            return res.status(201).json({
                message: "Data Uploaded Successfully.",
                users: dbdata
            });
        }
    } catch (error) {
        // Send the error as an object or a string
        return res.status(500).json({ message: "Data not uploaded", error: error.message });
    }
    }

module.exports = { addUser, deleteUser,usernameChange,updateUser,userLogin, sendotp,getUsers, getuserbyid, verifyotp,refferalusers}