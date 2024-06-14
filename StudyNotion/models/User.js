const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    accountType: {
        type: String,
        enum: ["Student", "Admin", "Instructor"],
        required: true,
    },
    additionalDetails: {
        type: mongoose.Schema.Types.ObjectID,
        required:true,
        ref: "Profile",
    },
    courses: [
            {
            type: mongoose.Schema.Types.ObjectID,
            ref: "Course",
            },
    ],
    image:{
        type: String,
        required:true,
    },
    token: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    courseProgress: [
            {
            type: mongoose.Schema.Types.ObjectID,
            ref: "courseProgress",
        },
    ]
},

)

module.exports = mongoose.model("User", userSchema);