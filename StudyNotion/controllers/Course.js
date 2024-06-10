const Course = require("../models/Course");
const Tag = require("../models/Category");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");

// createCourse handler function
exports.createCourse = async (req, res) =>{
    try{
        // fetch data
        const {courseName, courseDescription, whatYouWillLearn, price, tag} = req.body;

        // get thumbnail
        const thumbnail = req.files.thumbnailImage;

        // validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail){
            return res.status(400).json({
                success: false,
                message: "All field are required",
            })
        }

        // check for Instructor
        const userId = req.user.id;
        const  InstructorDetails = await User.findById(userId);
        console.log("Instructor Details: ", InstructorDetails);
        // TODO: verify that userid and instructor id are will be same or different

        if(!userId){
            return res.status(404).json({
                success: false,
                message: "Instructor Details not found", 
            });
        }

        // check given tag is vaild or not
        const tagDetails = await Tag.findById(tag);
        if(!tagDetails) {
            return res.status(404).json({
                success: false,
                message: 'Tag Details not found',
            })
        }

        // Upload Image to Cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        // Create an entry for new Course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: InstructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            tag: tagDetails._id,
            thumbnail: thumbnailImage.secure_url,
        })

        // add the new course to the user schema of instructor
        await User.findByIdAndUpdate({
                _id: InstructorDetails._id
            },
            {
                $push: {
                    course : newCourse._id,
                }
            },
            {new: true},
        );

        // update the tag ka Schema

         

        // return response
        return res.ststus(200).json({
            success: true,
            message: 'Course Created Sucessfully',
            data: newCourse,
        });

    } 
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message: 'Failed to create course'
        });
    }
}



// get All course handler function

exports.showAllCourses = async (req, res) =>{
    try{
        // find ka call mar do
        const allCourses = await Course.find({}, {courseName: true,
                                                    price:true,
                                                    thumbnail:true,
                                                    instructor:true,
                                                    ratingAndReview:true,
                                                    studentEnrolled:true,}).populate("instructor").exec();
        return res.status(200).json({
            success: true,
            message: 'Data for all courses feched successfully',
            data: allCourses,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Cannot fetch Course data',
            error: error.message,
        })
    }
}