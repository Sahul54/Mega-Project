const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();



// otp send
exports.sendOTP = async (res, req) =>{

    try{
        // fetch email from request ki body
        const {email} = req.body;

        // check if user already exist
        const checkUserPrestent = await User.findOne({email});

        // if user already exist , then return a response
        if(checkUserPrestent){
        return res.status(401).json({
            success: false,
            message: 'User already Registered',
        })
    }

         // Genetarte otp
         var otp = otpGenerator.generate(6,{
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
         });
         console.log("OTP Genetrated: ", otp);

        // check unique otp
        const result = await OTP.findOne({otp: otp});

        while(result) {
            otp = otpGenerator(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({otp: otp});
        }

        const otpPayload = {email, otp};

        // create an entry otp
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        // return response
        res.status(200).json({
            success:true,
            message: 'OTP sent Successfully',
            otp,
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }

}

// signup
exports.signUP = async (req, res) => {
    try{
        // data fetch kro req ki body se
        const{
            firstName,
            lastName,
            email,
            password, 
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;

       // validaton kr lo
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403)({
               success:false,
               message: "All fields are required",
            });
           }
   
       // 2 password match kr lo
       if(password !== confirmPassword){
           return res.status(400).json({
               success: false,
               message: 'password and confrimPassword value does not match, please try again',
           })
       }
   
       //  check user already exits or not
       const existingUser = await User.findOne({email});
       if(existingUser){
           return res.status(400).json({
               success: false,
               message: 'User is alredy registered',
           });
       }
   
       // find most recent otp stored for the user
       const recentOtp = await OTP.find({email}).sort({createdAt: -1}).limit(1);
       console.log(recentOtp);
       // validate otp
       if(recentOtp.length == 0){
           // otp not found
           return res.status(400).json({
               success:false,
               message: 'OTP not Found',
           })
           
       }
       else if(otp != recentOtp) {
           // Invalid otp
           return res.status(400).json({
               success: false,
               message: 'Invalid otp'
           }) 
       }
   
       // hash password
       const hasedPassword = await bcrypt.hash(password, 10);
   
       // make profile
       const profileDetails = await Profile.create({
           gender: null,
           dateOfBirth: null,
           about: null,
           contactNumber: null,
       });
       // entery create in db
       const user = await User.create({
           firstName, 
           lastName,
           email,
           contactNumber,
           password: hasedPassword,
           accountType,
           additionlDetails: profileDetails._id,
           image: `https://api.dicebear.com/8.x/lorelei/png` ,
       })
       // return res
       return res.status(200).json({
        success: true,
        message: 'User is registered Scussfully',
       })
    }
    catch(error){
       console.log(error);
       return res.status(500).json({
        success: false,
        message: "User cannot be registered . please try again",
       });
    }
}


// login
exports.login = async (req, res) =>{
    try{
        // get data from body
        const {email, password} = req.body;

        // vallidation data
        if(!email || ! password){
            return res.status(403).json({
                success: false,
                message: `All field are required, Please try again`,
            })
        }

        // user check exist or not
        const user = await User.fiundOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success:false,
                message: `User is not registered, please Signup first`,
            })
        }

        // generate JWT, after password matching
        if(await bcrypt.compare(password, user.password)){
            const payload = {
                email: user.email,
                id: user.id,
                accountType: user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "2h"  
            });
            user.token = token;
            user.password = undefined;

    
            // create cookie and send response
            const options = {
                expires: new Date(Date.now() + 3 * 24* 60 * 60 * 1000),
                httpOnly: true,
            }
            res.cookie("token", token, options). status(200).json({
                success: true,
                token,
                user, 
                message: 'Logged in successfully',
            })
        }
        else{
            return res.ststus(401).json({
                success:false,
                message: 'Password is incorrect',
            })
        }

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message: 'Login failure, Please try again',
        });
    }
}

// change password

exports.changePassword = async (req, res) =>{
    // gat data from reqest ki body
   
}