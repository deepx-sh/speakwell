import { UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudinary";
import AppError from "./AppError";
import { buffer } from "node:stream/consumers";

export const uploadImageToCloudinary = (
    buffer: Buffer,
    folder: string,
    publicId?:string
): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                ...(publicId && ({public_id:publicId})),
                overwrite: true,
                transformation: [
                    { width: 400, height: 400, crop: "fill", gravity: "face" },
                    { quality: "auto" },
                    {fetch_format:"auto"}
                ]
            },
            (error, result) => {
                if (error || !result) {
                    reject(new AppError("Image upload failed",500))
                } else {
                    resolve(result);
                }
            }
        )
        uploadStream.end(buffer)
    })
}

export const deleteImageFromCloudinary = async(
    imageUrl:string
): Promise<void> => {
    try {
        const parts = imageUrl.split("/");
        const uploadIndex = parts.indexOf("upload");

        if (uploadIndex === -1) return;

        const publicIdWithExtension = parts
            .slice(uploadIndex + 2)
            .join("/")
        
        const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, "");
        await cloudinary.uploader.destroy(publicId)
    } catch (error) {
        console.warn("Failed to delete old image from Cloudinary")
    }
}