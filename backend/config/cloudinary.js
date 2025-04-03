const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // set in .env
  api_key: process.env.CLOUDINARY_API_KEY,        // set in .env
  api_secret: process.env.CLOUDINARY_API_SECRET,  // set in .env
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'artist_images', // folder name in Cloudinary
    allowed_formats: ['jpeg', 'jpg', 'png', 'gif'],
  },
});

module.exports = { cloudinary, storage };
