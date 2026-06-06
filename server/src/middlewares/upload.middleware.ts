import multer from "multer";
import AppError from "../utils/AppError";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_FILE_SIZE = 2 * 1024 * 1024;

const storage = multer.memoryStorage();

const fileFilter = (
    _req: Express.Request,
    file: Express.Multer.File,
    cb:multer.FileFilterCallback
) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        cb(null,true)
    } else {
        cb(new AppError("Only JPEG, PNG, and WebP images are allowed",400)as any)
    }
}

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize:MAX_FILE_SIZE
    }
})