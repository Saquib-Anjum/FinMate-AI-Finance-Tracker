import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";

const TEMP_DIR = "temp";

// multer does not create the folder when `destination` is a function
fs.mkdirSync(TEMP_DIR, { recursive: true });

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, TEMP_DIR);
  },

  // random name: no user-controlled filename on disk, no collisions
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${crypto.randomUUID()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const err = new Error("Only JPEG, PNG, or WebP images are allowed");
    err.code = "INVALID_FILE_TYPE";
    cb(err, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
    files: 1,
  },
});

// Wrap multer so upload errors return a clean 400 instead of a 500
export const uploadAvatar = (req, res, next) => {
  upload.single("avatar")(req, res, (err) => {
    if (!err) return next();

    let message = err.message;
    if (err.code === "LIMIT_FILE_SIZE")
      message = "Image must be 5 MB or smaller";
    if (err.code === "LIMIT_UNEXPECTED_FILE")
      message = 'Upload the image in the "avatar" field';

    if (err instanceof multer.MulterError || err.code === "INVALID_FILE_TYPE") {
      return res.status(400).json({ success: false, message });
    }
    return next(err);
  });
};

export default upload;
