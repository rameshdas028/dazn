const jwt = require("jsonwebtoken");
const config =require('../config/config');
exports.auth = (req,res,next) =>{
    try {
      const token = req.headers.authorization;
      if(typeof token ==undefined){
        return res.status(401).json({
          statusCode:401,
          success:false,
          message:"You are not authenticated !"
        })
      }
      jwt.verify(token,config.jwt.secret,(err,data)=>{
        if (err) return res.status(401).json({statusCode:401,success:false,message:"Token has been expired."});
        req.user=data.sub;
        next();
      })
    } catch (error) {
      console.log(error);
        return res.status(500).json({
          statusCode:500,
          success:false,
          message:"You are not authenticated !"
        })  
      }
  }