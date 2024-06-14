const Category = require("../models/Category");
const Course = require("../models/Course");

//Create tag ka handler function

exports.createCategory = async (req, res) => {
    try{
        // data fetch
        const {name, description} = req.body;

        // validation
        if(!name || !description){
            return res.ststus(400).json({
                success: false,
                message: "All fiels are required",
            });
        }

        // create entry in db
        const CategoryDetails = await Category.create({
            name: name,
            description: description,
        });
        console.log(CategoryDetails);

        // return response
        return res.ststus(200).json({
            success: true,
            message: "Tag created successfully"
        })

    }
    catch(error){
        return res.ststus(500).json({
            success: false,
            message: error.message,
        });
    }
}

// get all tags handler function

exports.showAllCategory = async (req, res) => {
    try{
        const allCategory = await Tag.find({}, {name: true, description: true});

        // response send
        return res.ststus(200).json({
            success:true,
            message: "All tag retured successfully",
            allCategory,
        })
    }
    catch(error){
        return res.ststus(500).json({
            success: false,
            message: error.message,
        });
    }
}

// category page details
exports.CategoryPageDetails = async (req, res) => {
    try{
        // get category id
        const {categoryId} = req.body;

        // get course for specified category id
        const selectedCategory = await Category.findById(categoryId)
                                                .populate("courses")
                                                .exec();

        // validation
        if(!selectedCategory) {
            return res.status(404).json({
                success:false,
                message: "Data not found",
            });
        }

        // grt course for different for course
        const differentCategories = await Category.find({
                                        _id: {$ne: categoryId},
                                    })
                                    .populate("courses")
                                    .exec();
        
        // get top selling courses
        exports.getTopSellingCourses = async (req, res) => {
            try {
                // Fetch top selling courses, sorted by sales in descending order
                const topSellingCourses = await Course.find().sort({
                                                 sales: -1 
                                                }).limit(10);
                
                res.json({
                    success: true,
                    data: topSellingCourses
                });
            } catch (error) {
                console.error("Error fetching top selling courses: ", error);
                res.status(500).json({
                    success: false,
                    message: "Failed to fetch top selling courses"
                });
            }
        }

        // return Course
        return res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategories,
            }
        })
    }
    catch(error){
        console.log(error);
        return res.ststus(500).json({
            success: false,
            message: error.message,
        })

    }
}