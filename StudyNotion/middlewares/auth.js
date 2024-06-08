const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// auth
exports.auth = async (res, req, next) =>{
    try{
        // extract token
        const token = req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer ","");
        // if token is missing, then return res
        if(!token){
            return res.status(401).json({
                success: false,
                message: 'token is missing'
            })
        }
        
        // verify the token 
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        } 
        catch(error){
            //  verifaction - issue
            return res.status(401).json({
                success:false,
                message: 'token is invlid',
            })
        }
        next();
    }
    catch(error){
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'something went to wrong while validation the token'
        })   
    }
}
 
// isStudent
exports.isStudent = async (req, res, next) => {
    try{
       if(req.user.accountType !== "Student"){
        return res.status(401).json({
            success: false,
            message: 'This is Protected route for Student only',
        });
       }
       next();
    }
    catch(error){
       console.log(error);
       return res.status(500).json({
        success: false,
        message: 'User role cannot be verified, please try again'
       })
    }
}

// isInstructor
exports.isInstructor = async (req, res, next) => {
    try{
       if(req.user.accountType !== "Instructor"){
        return res.status(401).json({
            success: false,
            message: 'This is Protected route for Instructor only',
        });
       }
       next();
    }
    catch(error){
       console.log(error);
       return res.status(500).json({
        success: false,
        message: 'User role cannot be verified, please try again'
       })
    }
}

// isAdmin
exports.isAdmin = async (req, res, next) => {
    try{
       if(req.user.accountType !== "Admin"){
        return res.status(401).json({
            success: false,
            message: 'This is Protected route for Admin only',
        });
       }
       next();
    }
    catch(error){
       console.log(error);
       return res.status(500).json({
        success: false,
        message: 'User role cannot be verified, please try again'
       })
    }
}