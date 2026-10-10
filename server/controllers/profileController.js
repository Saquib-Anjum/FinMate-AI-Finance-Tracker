import profileModel from "../models/ProfileModel.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs/promises";
// GET PROFILE
const getProfile = async (req, res) => {
  try {
    const { userId } = req.user;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Failed to find user",
      });
    }

    const profile = await profileModel.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (err) {
    console.error("Get profile error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to get profile",
    });
  }
};

// UPDATE PROFILE
const updateProfile = async (req, res) => {
  let tempFile = null;
  try {
    const { userId } = req.user;

    const { bio, phone, country, currency } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Failed to find user",
      });
    }

    const profile = await profileModel.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    // Normal profile fields
    if (bio !== undefined) {
      profile.bio = bio;
    }

    if (phone !== undefined) {
      profile.phone = phone;
    }

    if (country !== undefined) {
      profile.country = country;
    }

    if (currency !== undefined) {
      profile.currency = currency;
    }

    // Uploaded avatar
    if (req.file) {
      console.log("Uploaded file:", req.file.path);
      tempFile = req.file.path;
      const result = await cloudinary.uploader.upload(tempFile, {
        folder: "finmate/profiles",
      });
      console.log(result.secure_url, "secure Url");
      // Save Cloudinary URL in MongoDB
      profile.avatar = result.secure_url;
    }
    await profile.save();
    //(delete that tempFile)

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: profile,
    });
  } catch (err) {
    console.error("Update profile error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  } finally {
    // Delete temporary file
    if (tempFile) {
      try {
        await fs.unlink(tempFile);
        console.log("Temporary file deleted");
      } catch (deleteError) {
        console.error("Failed to delete temporary file:", deleteError);
      }
    }
  }
};

// DELETE PROFILE
const deleteProfile = async (req, res) => {
  try {
    const { userId } = req.user;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Failed to find user",
      });
    }

    const profile = await profileModel.findOneAndDelete({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (err) {
    console.error("Delete profile error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to delete profile",
    });
  }
};

export { getProfile, updateProfile, deleteProfile };
