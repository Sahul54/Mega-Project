const Profile = require("../models/Profile");
const User = require("../models/User");

exports.updateProfile = async (req, res) => {
    try{
        // get data
        const {dateOfBirth= "", about= "", contactNumber, gender} = req.body;
      
        // get UserId
        const id = req.user.id;

        // validation
        if(!contactNumber || !gender || !id){
            return res.status(400).json({
                success: false,
                message: 'All field are required',
            });
        }
        // find Profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        // update Profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber= contactNumber;
        await profileDetails.save();

        //  return response
        return res.status(200).json({
            success:true,
            message: 'Profile Update sucessfully',
            profileDetails,
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message, 
        })
    }
}

// delete account
exports.deleteAccount = async (req, res) => {
    try{
        // get id
        const id = req.user.id;
        // validation
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(400).json({
                success: false,
                message: 'user not found',
            });
        }
        // delete  Profile
        await Profile.findByIdAndDelete({_id: userDetails.additionalDetails});

        // TODO : HW unenroll user from all enrolled course
        
        // delete user
        await User.findByIdAndDelete({_id: id});

        // HW : How can be scuddule a job to delete account 
        //cron jon--> npm install express mongoose node-cron  (install karna baki hai)
        cron.schedule('0 0 * * *', async () => {
            try {
              // Calculate the date 5 days ago from now
              const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
              
              // Delete records older than 5 days
              const result = await Record.deleteMany({ createdAt: { $lt: fiveDaysAgo } });
              console.log(`Deleted ${result.deletedCount} records`);
            } catch (error) {
              console.error('Error deleting records:', error);
            }
          });

        // return response
        return res.status(200).json({
            success:true,
            message:'User deleted sucessfully'
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: 'User can not be deleted successfully',
        })
    }
}


// Get all User details
exports.getAllUserDetails = async (req, res) =>{
    try{
        // get id
        const id = req.user.id;

        // validation and get user details
        const userDetails = await User.findById(id).populate("additionDetails").exec();

        // return response
        return res.status(200).json({
            success:true,
            message: 'User data fetched sucessfully'
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'User details not found'
        })
    }
}
