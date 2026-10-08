import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const accessToken = token.split(" ")[1];

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);

    req.user = decodedToken;

    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export { protect };
