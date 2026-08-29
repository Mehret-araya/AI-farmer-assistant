import Crop from "../models/Crop.js";
import CropImage from "../models/CropImage.js";
import cloudinary from "../config/cloudinary.js";

export const uploadCropImage = async (req, res) => {
  try {
    const { cropId } = req.params;

    // 1. Check that an image was received
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please provide an image",
      });
    }

    // 2. Check that the crop belongs to the logged-in user
    const crop = await Crop.findOne({
      _id: cropId,
      userId: req.user.userId,
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found",
      });
    }

    // 3. Upload the image to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "ai-farmer-assistant/crops",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(req.file.buffer);
    });

    // 4. Save Cloudinary information in MongoDB
    const cropImage = await CropImage.create({
      userId: req.user.userId,
      cropId: crop._id,
      imageUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });

    // 5. Return result
    return res.status(201).json({
      success: true,
      message: "Crop image uploaded successfully",
      image: {
        id: cropImage._id,
        cropId: cropImage.cropId,
        imageUrl: cropImage.imageUrl,
        publicId: cropImage.publicId,
        createdAt: cropImage.createdAt,
      },
    });
  } catch (error) {
    console.error("Crop image upload error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while uploading crop image",
      error: error.message,
    });
  }
};


// Get all images belonging to a crop
export const getCropImages = async (req, res) => {
  try {
    const { cropId } = req.params;

    // Check that the crop belongs to the logged-in user
    const crop = await Crop.findOne({
      _id: cropId,
      userId: req.user.userId,
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found",
      });
    }

    // Get images for this crop
    const images = await CropImage.find({
      cropId: crop._id,
      userId: req.user.userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      images,
    });
  } catch (error) {
    console.error("Get crop images error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while retrieving crop images",
    });
  }
};

