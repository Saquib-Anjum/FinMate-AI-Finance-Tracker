import passport from "passport";
import axios from "axios";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import userModel from "../models/userModel.js";
import profileModel from "../models/ProfileModel.js";

const findOrCreateUser = async ({
  provider,
  providerId,
  email,
  name,
  avatar,
}) => {
  const providerField = provider === "google" ? "googleId" : "githubId";
  const normalizedEmail = email?.toLowerCase();

  if (!normalizedEmail) {
    throw new Error("A verified email is required");
  }

  let user = await userModel.findOne({
    [providerField]: providerId,
  });

  if (!user) {
    user = await userModel.findOne({ email: normalizedEmail });

    if (user) {
      // Link the provider to an existing account.
      user[providerField] = providerId;
      await user.save();
    } else {
      user = await userModel.create({
        name: name || normalizedEmail.split("@")[0],
        email: normalizedEmail,
        [providerField]: providerId,
      });
    }
  }

  await profileModel.findOneAndUpdate(
    { userId: user._id },
    {
      $setOnInsert: { userId: user._id },
      ...(avatar ? { $set: { avatar } } : {}),
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
    },
  );

  return user;
};

// Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const emailData = profile.emails?.find(
          (item) => item.value,
        );

        if (
          !emailData?.value ||
          profile._json?.email_verified !== true
        ) {
          return done(null, false, {
            message: "A verified Google email is required",
          });
        }

        const user = await findOrCreateUser({
          provider: "google",
          providerId: profile.id,
          email: emailData.value,
          name: profile.displayName,
          avatar: profile.photos?.[0]?.value || "",
        });

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

// GitHub OAuth
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/github/callback`,
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { data: emails } = await axios.get(
          "https://api.github.com/user/emails",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/vnd.github+json",
            },
          },
        );

        const emailData = emails.find(
          (item) => item.verified && item.primary && item.email,
        );

        if (!emailData) {
          return done(null, false, {
            message: "A verified primary GitHub email is required",
          });
        }

        const user = await findOrCreateUser({
          provider: "github",
          providerId: String(profile.id),
          email: emailData.email,
          name: profile.displayName || profile.username,
          avatar: profile.photos?.[0]?.value || "",
        });

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

export default passport;