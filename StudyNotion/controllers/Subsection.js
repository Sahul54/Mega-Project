const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// create SubSection
exports.createSubSection = async (req, res) => {
    try{
        // fetch data from req body
        const {sectionId, title, timeDuration, description} = req.body;

        // extract file/video
        const video = req.files.videoFile;

        // validation
        if(!sectionId || !title || !timeDuration || !description || !video) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            })
        }

        //  upload video to clodinarry then return scureURL
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

        // create a sub section
        const subSectionDetails = await subSectiom.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            videUrl: uploadDetails.secure_url,
        })
        // update section with this subsection objectId
        const updatedSection = await Section.findByIdAndUpdate({_id: sectionId},
                                {$push: {
                                    subSection: subSectionDetails._id,
                                }},
                                {new:true},
                            );
        
                            // HW : log update section here, after adding populate quarey
        // return response
        return res.status(200).json({
            success: true,
            message: 'SubSection created Sucessfully',
            updatedSection,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: ''
        })
    }
}

// update subsection 

// delete subsection