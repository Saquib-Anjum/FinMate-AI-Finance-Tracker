import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import userModel from "../models/userModel.js";

const findOrCreateUser = async ({
  provider,
  providerId,
  email,
  name,
}) => {
  const providerField = provider === "google" ? "googleId" : "githubId";

  let user = await userModel.findOne({
    [providerField]: providerId,
  });

  if (user) return user;

  if (!email) {
    throw new Error("A verified email is required");
  }

  user = await userModel.findOne({ email: email.toLowerCase() });

  if (user) {
    user[providerField] = providerId;
    await user.save();
    return user;
  }

  return userModel.create({
    name: name || email.split("@")[0],
    email: email.toLowerCase(),
    [providerField]: providerId,
  });
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
          (item) => item.verified === true || item.verified === undefined
        );

        if (!emailData?.value || profile._json?.email_verified !== true) {
          return done(null, false, {
            message: "A verified Google email is required",
          });
        }

        const user = await findOrCreateUser({
          provider: "google",
          providerId: profile.id,
          email: emailData.value,
          name: profile.displayName,
        });

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
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
        const emailData = profile.emails?.find(
          (item) => item.verified === true && item.value
        );

        if (!emailData?.value) {
          return done(null, false, {
            message: "A verified GitHub email is required",
          });
        }

        const user = await findOrCreateUser({
          provider: "github",
          providerId: String(profile.id),
          email: emailData.value,
          name: profile.displayName || profile.username,
        });

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;