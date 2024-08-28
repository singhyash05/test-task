import { v2 as cloudinary } from 'cloudinary';

// Function to upload a PDF to Cloudinary and get the URL
export const uploadOnCloudinary = async function(filePath) {
    try {
        // Configure Cloudinary
        cloudinary.config({ 
            cloud_name: 'dk9flig0h', 
            api_key: process.env.CLOUDINARY_API_KEY, 
            api_secret: process.env.CLOUDINARY_API_SECRET 
        });

        // Upload the PDF
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            resource_type: 'raw', // Specify that this is a raw file (e.g., PDF)
        });

        // Generate the URL for the uploaded file
        const pdfUrl = cloudinary.url(uploadResult.public_id, {
            resource_type: 'raw', // Specify the resource type as 'raw' for non-image files
            fetch_format: 'auto',
            quality: 'auto'
        });

        return pdfUrl;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error; // Rethrow the error to handle it further up the call stack
    }
};
