const mongoose = require("mongoose");

require("dotenv").config();

exports.connect = () =>{
    mongoose.connect(process.env.MONGODB_URL, {

    })
    .then(console.log("DB connect successfuly"))
    .catch( (error) => {
        console.log("DB conntectio failed");
        console.error(error);
        process.exit(1);
    });
} 