import { v2 as cloudinary } from 'cloudinary';

const uploadOnCloudinary  = async function(filePath) {

    // Configuration
    cloudinary.config({ 
        cloud_name: 'dk9flig0h', 
        api_key: `${process.env.CLOUDINARY_API_KEY}`, 
        api_secret: `${process.env.CLOUDINARY_API_SECRET}` 
    });
    
    // Upload a PDF
    const uploadResult = await cloudinary.uploader
        .upload(
            filePath,
            {
                resource_type: 'raw', // Specify that this is a raw file (e.g., PDF, DOCX)
            }
        )
        .catch((error) => {
            console.log(error);
        });
    
    console.log(uploadResult);
    
    // Optimize delivery by applying auto-format and quality adjustments (optional)
    const optimizeUrl = cloudinary.url(uploadResult.public_id, {
        resource_type: 'raw', // Specify the resource type as 'raw' to handle non-image files
        fetch_format: 'auto',
        quality: 'auto'
    });
    
    return (optimizeUrl)
    
    // Since cropping and other image-specific transformations don't apply to PDFs, 
    // you can skip that part for PDF files.
    
};

export {uploadOnCloudinary}
