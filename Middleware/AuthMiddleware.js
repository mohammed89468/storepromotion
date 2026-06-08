const AuthMiddleware = (req,res,next) =>
{
 if(!req.session.userId)
 {
     
    return res.status(401).json({
        success:false,
        message:"UnAuthorized"
    });
   
 }
  next();
}

module.exports = AuthMiddleware;