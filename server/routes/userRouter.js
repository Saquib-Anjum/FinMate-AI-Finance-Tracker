import { Router } from "express";
import passport from "../config/passport.js";
import { login, signup, getMe } from "../controllers/userController.js";
import { oauthSuccess, exchangeOAuthCode } from "../controllers/oauthController.js";
import { protect } from "../middlewares/auth.js";

const userRouter = Router();

// Existing authentication routes
userRouter.post("/signup", signup);
userRouter.post("/login", login);

// Google OAuth
userRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

userRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed`,
  }),
  oauthSuccess
);

// GitHub OAuth
userRouter.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
    session: false,
  })
);

userRouter.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed`,
  }),
  oauthSuccess
);

// Exchange OAuth code for JWT
userRouter.post("/exchange", exchangeOAuthCode);

// Get authenticated user
userRouter.get("/me", protect, getMe);

export default userRouter;