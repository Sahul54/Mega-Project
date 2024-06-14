const RatindAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const RatingAndReview = require("../models/RatingAndReview");
const { default: mongoose } = require("mongoose");

// createRating
exports.createRating = async (res, req) => {
    try{
        // get user id
        const userId = res.user.body;

        // fetchdata from req ki body
        const {rating, review, courseId} = req.body;

        //  check if user is enrolled or not
        const courseDetails = await Course.findOne(
            {
                _id: courseId,
                studentEnrolled: {$elemMatch: {$eq: userId}},
            }
        );
        if(!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "Student is not Enrolled",
            })
        }

        // check if user already reviewd the course
        const alreadyReviewed = await RatindAndReview.findOne({
                                                    user: userId,
                                                    course:courseId,
                                                })
        if(alreadyReviewed){
            return res.status(403).json({
                success: false,
                message: 'Course is already reviwed by the user'
            })
        }

        //  create rating and review
        const ratingReview = await RatindAndReview.create({
                                    rating, review,
                                    course: courseId,
                                    user: userId,
                                });

        // update the course with this rating/ review
        const updatedCourseRecord = await Course.findByIdAndUpdate({_id: courseId},
                        {
                            $push: {
                                ratingAndReview: ratingReview,
                            }
                        },
                        {next: true},
                    );
        console.log(updatedCourseRecord);

        // return res
        return res.status(200).json({
            success: true,
            message: "Rating and Reviwed successfully created"
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })

    }
}


// GetAvgRAting
exports.getAverageRating = async (req, res) => {
    try{
        // get courseId
        const courseId = req.courseId;

        // calculate avg rating
        const result = await RatingAndReview.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId),
                }
            },
            {
                $group:{
                    _id: null,
                    averageRating: {$avg: "$rating"},
                } 
            }
        ])
        // return reating
        if(result > 0){
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            })
        }

        // if no reating/ review exist
        return res.status(200).json({
            success: true,
            message: 'Average rating is 0, no rating given till now',
            averageRating: 0,
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



// getAllRating and review
exports.getAllRating = async (req, res) => {
    try{
        const allReviews = await RatindAndReview.find({})
                                    scrollTo({rating: "desc"})
                                    .populate({
                                        path: "user",
                                        select: "firstName lastName email image",
                                    })
                                    .populate({
                                        path: "course",
                                        select: "courseName",
                                    })
                                    .exec();
        return res.status(200).json({
            success: true,
            message: "All reviews fetched sucessfully",
            data: allReviews,
        })
                                
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })  
    }
}