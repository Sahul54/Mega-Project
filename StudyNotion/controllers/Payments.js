const {instance} = require("../config/razoypay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const courseEnrollmentEmail = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");

// capture the payment  and initialte the Razorpay order
exports.capturePayment = async (req, res) => {

        // get courseId and user id
        const {course_id} = req.body;
        const userId = req.user.id;
        
        // validation
        if(!course_id){
            return res.json({
                success: false,
                message: "Please privide the valid Course Id" 
            })
        }
    // vaild courseId
    let course;
    try{
        course = await Course.findById(course_id);
        if(!course){
            return res.json({
                success: false,
                message: "Could not find the course",
            })
        }
        // vaild CourseDetail
        // user already Pay the same Course
        const uid = new mongoose.Types.ObjectId(userId);
        if(course.studentEnrolled.includes(uid)){
            return res.status(200).json({
                success: false,
                message: 'Student is already enrolled',
            });
        }
        
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
    // order create
    const amount = course.price;
    const currency = "INR";

    const options = {
        amount: amount * 100,
        currency,
        receipt: Math.random(Date.now()).toString(),
        notes:{
            courseId: course_id,
            userId,
        }
    };

    // function call
    try{
        // initiate the payment using razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);

        // return response
        return res.status(200).json({
            success: true,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            thumbnail: course.thumbnail,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount,
        })
    }
    catch(error){

    }
};


//  2. varify Signature of Rozorpay and Server

exports.verifySignature = async (req, res) =>{
    const webhookSecret = "12345678";

    const signature = req.headers["x-razorpay-signature"];
    
    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if(signature === digest){
        console.log("Payment is Authorised");

        const { courseId, userId} = req.body.payload.entity.notesl;

        try{
            // full fill action
            // find the course and enroll the course
            const enrolledCourse = await Course.findOneAndUpdate(
                                                {_id: courseId},
                                                {$push: {studentEnrolled: userId}},
                                                {new: true},
                                            )


            if(!enrolledCourse) {
                return res.status(500).json({
                    success:false,
                    message: 'Course not found',
                });
            }
            console.log(enrolledCourse);

            // find the student and the course to their list of enrolled course me
            const enrolledStudent = await User.findOneAndUpdate(
                {_id: userId},
                {$push: {course:courseId}},
                {new: true},
            );

            console.log(enrolledStudent);

            // mail send kr do confrinmation k liye
            const emailResponse = await mailSender(
                enrolledStudent.email,
                "Congratulations  from StudyNotion",
                "Congratulations, You are onboreded into new StudyNotion",
            );

            console.log(emailResponse);

            return res.status(200).json({
                success: true,
                message: 'Signature verified and Course Added'
            });
        }
        catch(error){
            console.log(error);
            return res.status(500).json({
                success: false,
                message: error.message,
            }) 
        }
    }
    else{
        return res.status(400).json({
            success: false,
            message: "Invalid request"
        })
    }
}