const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

// Load environment variables from the .env file in the root of the backend folder
dotenv.config();

const cloudinaryConnect = () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        console.log("Cloudinary connected successfully.");
    } catch (error) {
        console.error("Cloudinary connection failed:", error);
    }
};

module.exports = cloudinaryConnect;