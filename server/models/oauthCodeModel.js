import mongoose from "mongoose";

const oauthCodeSchema = new mongoose.Schema(
  {
    codeHash: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      expires: 0,
    },
  },
  {
    timestamps: true,
  }
);

const oauthCodeModel =
  mongoose.models.OAuthCode ||
  mongoose.model("OAuthCode", oauthCodeSchema);

export default oauthCodeModel;