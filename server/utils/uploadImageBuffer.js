const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = async function uploadImageBuffer(base64String) {
    const upload = await cloudinary.uploader.upload(base64String, {
        folder: "products",
    });
    return upload.secure_url;
};
