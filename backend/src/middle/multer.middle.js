import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`);
    }
})

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif", "image/webp"];
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if(extname && mimeType) {
        cb(null, true)
    } else {
        cb(new Error("Unsupported file extension"));
    }
}

export const upload = multer({
    storage,
    fileFilter,
    limits: {fileSize: 5 * 1024 * 1024},
})