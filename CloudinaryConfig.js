// backend/config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'df3cizenp',  // Replace with your Cloudinary Cloud Name
  api_key: '751189796277713',       // Replace with your Cloudinary API Key
  api_secret: 'mIQL-w4lW54N8TMEQLTOlshwzGI'  // Replace with your Cloudinary API Secret
});

export default cloudinary;
