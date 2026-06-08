const shops = require('../Models/Shops');
const otpmobilemodel = require('../Models/OtpMobileModel');
const otpemailmodel = require('../Models/OtpEmailModel');
const bcrypt =  require('bcrypt');
const crypto = require("crypto");
const addShop = async (req,res) =>
    {
        try{
        const {shopname,username,password,email,mobile,location} = req.body;
       
        const shopfind =  await shops.findOne({username:username});
        if(shopfind){
            return res.status(200).json({
                message:"user is already exist"
            })
        }
        const newshopcode = crypto.randomInt(111111,666666);
        var shopData = new shops({
            shopname:shopname,
            username:username,
            password:password,
            email:email,
            mobile:mobile,
            location:location,
            shopCode:newshopcode
            
        })
       var shopStatus = await shopData.save();

       //const dbdata= await shops.find();

     if (shopStatus) {
            return res.status(201).json({
                message: "Data Uploaded Successfully.",
                //users: dbdata
            });
        }
    } catch (error) {
        // Send the error as an object or a string
        return res.status(500).json({ message: "Data not uploaded", error: error.message });
    }
    }
    const deleteShop = async (req,res) =>
    {
        try{
        const {username} = req.body;
        const deletedata = await shops.deleteMany({username:username});
        if(deletedata.deletedCount==0)
        {
            return res.status(200).json({
                message:"no data is there"
            })
        }
        const dbdata = await shops.find(); 
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
    const updateShop = async (req,res) => 
    {
         try{
             const {username,password} = req.body;
            if(!username || !password)
            {
                return res.status(400).json({message:"Fill all fields in the form."})
            }
           console.log("Before Update");

             const updateUser = await shops.findByIdAndUpdate(
            req.params.id,
            { username, password },
            { returnDocument: 'after' }
                );

            console.log("After Update");
            if(!updateUser){
            return res.status(404).json({message:"Something Went wrong!"});
            }
         
           
            return res.status(200).json({message:"Update Sucessfully",data:updateUser});
           
         }catch(err)
         {
            return res.status(500).json({message:"Error:"+err.message});

         }
    }
   const shopChanges = async (req,res) =>
   {
    try{
        const shopchages = req.body;
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({
                message: "Shop ID is required"
            });
        }

        if (!shopchages) {
            return res.status(400).json({
                message: "Fill All Fields is required"
            });
        }
        if(shopchages){
        const salt = await bcrypt.genSalt(10);
        shopchages.password = await bcrypt.hash(shopchages.password,salt);
        }
        const usernameUpdated = await shops.findByIdAndUpdate(
            req.params.id,
            {$set:shopchages},
           { returnDocument: 'after' }

        );
        if(!usernameUpdated)
        {
            return res.status(404).json({message:"User not found! "});
        }
        return res.status(200).json({message:"Update Sucessfully",data:usernameUpdated});
    }catch(err)
    {
        return res.status(500).json({message:"Error:"+err.message})
    }


   }
   const getShops = async (req,res) =>
   {
     try{
        const userdata = await shops.find();
        if(!userdata)
        {
            return res.status(404).json({message:"not found"});
        }
        else
        {
            return res.status(200).json({message:"fetch user sucessfully",data:userdata,userid:req.session.userId});
        }

     }catch(err)
     {
        return res.status(500).json({message:"Something went wrong"})
     }
   } 
   const getshopbyid = async (req,res) =>
   {
    try
    {
        
        const userid = req.params.id;

        const userdata = await shops.findOne({_id:userid});
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
    const shopLogin = async (req,res) =>
   {
    try
    {
        const {username,password} = req.body;
        if(!username)
        {
            return res.status(400).json({message:"Fill the username"});
        }
      const userfind =  await shops.findOne({username:username});
      if(!userfind)
      {
        return res.status(200).json({message:"User not found"});
      }
      const passwordverify = await userfind.verifyPassword(password);
      if(!passwordverify)
      {
        return res.status(200).json({message:"Invalid Password"});
      }
     req.session.userId = userfind._id;
     req.session.username = userfind.username;
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
        const findUser = await shops.findOne({mobile:mobile});
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
        const findUser = await shops.findOne({mobile:mobile});
         
      
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
        const findUser = await shops.findOne({email:email});
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
        const findUser = await shops.findOne({mobile:mobile});
         
      
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
//   const refferalusers = async (req,res) =>
//     {
//         try{
//         const {username,password,email,mobile,refferalcode} = req.body;
       
//         const userfind =  await shops.findOne({username:username});
//         if(userfind){
//             return res.status(200).json({
//                 message:"user is already exist"
//             })
//         }

//         const oldrefferal  = await shops.findOne({refferalcode:refferalcode});
//         if(!oldrefferal)
//         {
//             return res.status(200).json({
//                 message:"No such refferal are exists"
//             })
//         }
//         const newreferalcode = crypto.randomInt(111111,666666);
//         var userData = new user({
//             username:username,
//             password:password,
//             email:email,
//             mobile:mobile,
//             referalcode:newreferalcode

//         })

//        var userStatus = await userData.save();

//         const refferaladd = new refferal({
//             olduserref:oldrefferal._id,
//             newuserref:userStatus._id
//         });
//         refferaladd.save();
//        const dbdata= await shops.find();

//      if (userStatus) {
//             return res.status(201).json({
//                 message: "Data Uploaded Successfully.",
//                 users: dbdata
//             });
//         }
//     } catch (error) {
//         // Send the error as an object or a string
//         return res.status(500).json({ message: "Data not uploaded", error: error.message });
//     }
//     }

module.exports = { addShop, deleteShop, shopChanges, updateShop, shopLogin, sendotp,getShops, getshopbyid, verifyemailotp, verifyemailotp, verifyotp}