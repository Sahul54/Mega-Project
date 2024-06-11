const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        trim: true,
    },
    courseDescription: {
        type : String,
        trim : true,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    whatYouWillLearn: {
        type: String,
        trim: true,
    },
    CourseContent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
    }],
    ratingAndReview: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingAndReview",
    }],
    price: {
        type: Number,
    },
    thumbnail: {
        type: String,
    },
    tag: {
        type: [String],
        requiredL: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
    },
    studentEnrolled: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    instructor: {
        type: [String],
    },
    status: {
        type: String,
        enum: ["Draft", "Published"],
    },
});


module.exports = mongoose.model("Course", courseSchema);