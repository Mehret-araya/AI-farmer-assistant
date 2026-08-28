import Crop from "../models/Crop.js";

// Create a crop
export const createCrop = async (req, res) => {
  try {
    const {
      name,
      variety,
      plantingDate,
      growthStage,
      location,
      farmSize,
    } = req.body;

    if (!name || !plantingDate) {
      return res.status(400).json({
        success: false,
        message: "Crop name and planting date are required",
      });
    }

    const crop = await Crop.create({
      userId: req.user.userId,
      name,
      variety: variety || "",
      plantingDate,
      growthStage: growthStage || "",
      location: location || "",
      farmSize: farmSize || 0,
    });

    return res.status(201).json({
      success: true,
      message: "Crop created successfully",
      crop,
    });
  } catch (error) {
    console.error("Create crop error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating crop",
    });
  }
};

// Get all crops belonging to the logged-in user
export const getCrops = async (req, res) => {
  try {
    const crops = await Crop.find({
      userId: req.user.userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      crops,
    });
  } catch (error) {
    console.error("Get crops error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while retrieving crops",
    });
  }
};

// Get one crop belonging to the logged-in user
export const getCropById = async (req, res) => {
  try {
    const crop = await Crop.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found",
      });
    }

    return res.status(200).json({
      success: true,
      crop,
    });
  } catch (error) {
    console.error("Get crop error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while retrieving crop",
    });
  }
};

// Update a crop belonging to the logged-in user
export const updateCrop = async (req, res) => {
  try {
    const {
      name,
      variety,
      plantingDate,
      growthStage,
      location,
      farmSize,
    } = req.body;

    const crop = await Crop.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found",
      });
    }

    if (name !== undefined) crop.name = name;
    if (variety !== undefined) crop.variety = variety;
    if (plantingDate !== undefined) crop.plantingDate = plantingDate;
    if (growthStage !== undefined) crop.growthStage = growthStage;
    if (location !== undefined) crop.location = location;
    if (farmSize !== undefined) crop.farmSize = farmSize;

    await crop.save();

    return res.status(200).json({
      success: true,
      message: "Crop updated successfully",
      crop,
    });
  } catch (error) {
    console.error("Update crop error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating crop",
    });
  }
};

// Delete a crop belonging to the logged-in user
export const deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found",
      });
    }

    await Crop.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Crop deleted successfully",
    });
  } catch (error) {
    console.error("Delete crop error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting crop",
    });
  }
};