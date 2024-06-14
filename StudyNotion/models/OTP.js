const mongosoe = require("mongoose");
const mailSender = require("../utils/mailSender");
const OTPSchema = new mongosoe.Schema({
    email: {
        String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    cerateAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60,
    },

})


// A fuction -> to send mail
async function sendVerificationEmail(email, otp){
    try{
        
        const mailResponse = awaitSender(email, "Verification from StudyNotation", otp);
        console.log(`Email sent Successfully: `, mailResponse);
    }
    catch(error){
        console.log("error occred while sending mail: ", error);
    }
}

OTPSchema.pre("save", async function(next){
    await sendVerificationEmail(this.email, this.otp);
    next();
})



module.exports = mongosoe.model("OTP", OTPSchema);