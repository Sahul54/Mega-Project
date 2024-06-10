const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createCourse = async (req, res) => {
    try{
    // data fetch
    const {sectionName, CourseId} = req.body;

    // data validation
    if(!sectionName || !CourseId){
        return res.status(400).json({
            success: false,
            Message: 'Missing Properties',
        })
    }

    // Create Section
    const newSection = await Section.create({sectionName})

    // Update Course with section objectId
    const updateCourseDetails = await Course.findByIdAndUpdate(
                                    CourseId,
                                    {
                                        $push: {
                                            CourseContent: newSection,_id,
                                        }
                                    },
                                    {new: true},
                                )
    // HW: use populate to repalce section/ sub section both in updateCourseDetails

    // return respose 
    return res.status(200).json({
        success: true,
        Message: 'Section Created Sucessfully'
    })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            Message: 'unable to update section , Please try again',
        })
    }
}

// update section
exports.updateSection = async (req, res) => {
    try{
        // data input
        const {sectionName, sectionId} = req.body;

        // data validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success: false,
                Message: 'Missing Properties',
            })
        }
    
        //  update data
        const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new: true});

        //  return response
        return res.status(200).json({
            success: true,
            Message: 'Section update scuccessfuly',
        })


    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            Message: 'unable to update section , Please try again',
        })
    }
}


// Delete section
exports.deleteSection = async (req, res) => {
    try{
        // get Id       
        const {section} = req.params;

        // use findByIdAndDelete
        await Section.findByIdAndDelete(section);
        //  Todo[testing]: do we need to delete the entry from the course schema?
        
        // return response
        return res.status(200).json({
            success: true,
            Message: "Section Deleted Successfully",
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            Message: 'unable to update section , Please try again',
        })
    }
}

