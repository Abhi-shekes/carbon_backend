import StoreLocation from "../models/storeLocation.model.js";
import { validateLocation } from "../middleware/validators/location.validator.js";

// Create a new location
export const createLocation = async (req, res) => {
  try {
    if (req.user.type != "admin") {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Access" });
    }

    const { error } = validateLocation(req.body);

    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    const location = new StoreLocation(req.body);
    const savedLocation = await location.save();
    res.status(201).json({ success: true, data: savedLocation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all locations with pagination
export const getAllLocations = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;

    const totalLocations = await StoreLocation.countDocuments();
    const locations = await StoreLocation.find()
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      totalLocations,
      totalPages: Math.ceil(totalLocations / limit),
      currentPage: page,
      data: locations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a location by ID
export const updateLocation = async (req, res) => {
  try {
    if (req.user.type != "admin") {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Access" });
    }

    const { error } = validateLocation(req.body);

    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    const updatedLocation = await StoreLocation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedLocation) {
      return res
        .status(404)
        .json({ success: false, message: "Location not found" });
    }
    res.status(200).json({ success: true, data: updatedLocation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single location by ID
export const getLocationById = async (req, res) => {
  try {
    const location = await StoreLocation.findById(req.params.id);
    if (!location) {
      return res
        .status(404)
        .json({ success: false, message: "Location not found" });
    }
    res.status(200).json({ success: true, data: location });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a location by ID
export const deleteLocation = async (req, res) => {
  try {
    if (req.user.type != "admin") {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Access" });
    }

    const deletedLocation = await StoreLocation.findByIdAndDelete(
      req.params.id
    );
    if (!deletedLocation) {
      return res
        .status(404)
        .json({ success: false, message: "Location not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Location deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
