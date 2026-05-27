import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { productService } from "./product.service";
import AppError from "../../utils/AppError";
import { uploadToCloudinary } from "../../config/cloudinary";
import { addProductSchema } from "./product.validation";


const addProduct = catchAsync(async (req: Request, res: Response,) => {
    const parsed = addProductSchema.safeParse(JSON.parse(req.body.data));
    if (!parsed.success) {
        throw parsed.error;
    }
    const data = parsed.data;

    const images = req.files as Express.Multer.File[] | undefined;
    if (!images || images.length == 0) {
        throw new AppError(400, "At least one image is required");
    }
    const uploadedImages: { public_id: string; secure_url: string; }[] = [];
    const uploadPromises = images.map((image) => {
        return uploadToCloudinary({
            file: image,
            folder: "products",
        });
    });
    try {
        const results = await Promise.all(uploadPromises);
        const formattedResults = results.map((result) => ({
            public_id: result.public_id,
            secure_url: result.secure_url,
        }));
        uploadedImages.push(...formattedResults);
    }
    catch (error) {
        console.error("Error uploading images to Cloudinary:", error);
        throw new AppError(500, "Failed to upload images");
    }

    const product = await productService.addProduct(data, uploadedImages);

    res.status(201).json({
        ok: true,
        message: "Product added successfully",
        data: product,
    });
});
export const productController = {
    addProduct,
};