import crypto from "crypto";
import userModel from "../models/userModel.js";
import profileModel from "../models/ProfileModel.js";
import oauthCodeModel from "../models/oauthCodeModel.js";
import generateToken from "../utils/generateToken.js";

// OAuth success callback
const oauthSuccess = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/login?error=oauth_failed`,
      );
    }

    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/login?error=user_not_found`,
      );
    }

    // Create profile if it does not exist
    await profileModel.findOneAndUpdate(
      { userId: user._id },
      { $setOnInsert: { userId: user._id } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    // Generate a secure, short-lived OAuth code
    const code = crypto.randomBytes(32).toString("hex");
    const codeHash = crypto.createHash("sha256").update(code).digest("hex");

    await oauthCodeModel.create({
      codeHash,
      userId: user._id,
      expiresAt: new Date(Date.now() + 60 * 1000),
    });

    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?code=${encodeURIComponent(code)}`,
    );
  } catch (error) {
    console.error("OAuth success error:", error.message);

    return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
  }
};

// Exchange OAuth code for JWT
const exchangeOAuthCode = async (req, res) => {
  try {
    const { code } = req.body;

    if (typeof code !== "string" || !/^[a-f0-9]{64}$/.test(code)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OAuth code",
      });
    }

    const codeHash = crypto.createHash("sha256").update(code).digest("hex");

    // Atomically consume the code to prevent reuse
    const storedCode = await oauthCodeModel.findOneAndDelete({
      codeHash,
      expiresAt: { $gt: new Date() },
    });

    if (!storedCode) {
      return res.status(401).json({
        success: false,
        message: "OAuth code is invalid, expired, or already used",
      });
    }

    const user = await userModel.findById(storedCode.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const token = generateToken({ userId: user._id });

    return res.status(200).json({
      success: true,
      message: "OAuth login successful",
      token,
    });
  } catch (error) {
    console.error("OAuth exchange error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to complete OAuth login",
    });
  }
};

export { oauthSuccess, exchangeOAuthCode };
