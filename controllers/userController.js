import Credential from "../models/credential.model.js";

export const getPoints = async (req, res) => {
  try {
    const userPoints = await Credential.findById(req.user.id).select(
      "totalPoints"
    );

    if (!userPoints) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Points fetched successfully",
      totalPoints: userPoints.totalPoints,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
