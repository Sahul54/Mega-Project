const Category = require("../models/Category");

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