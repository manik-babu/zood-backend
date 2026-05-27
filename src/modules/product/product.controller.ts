import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { productService } from "./product.service";
import AppError from "../../utils/AppError";
import { uploadToCloudinary } from "../../config/cloudinary";
import { addProductSchema } from "./product.validation";
import { FilterProducts } from "./product.interface";
import { ProductStatus } from "../../../generated/prisma/enums";


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
const getProducts = catchAsync(async (req: Request, res: Response) => {
    const filter: FilterProducts = {
        search: (req.query.search as string) || "",
        status: (req.query.status as ProductStatus | "ALL") || "ALL",
        sort: (req.query.sort as "asc" | "desc") || "desc",
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
    }
    const products = await productService.getProducts(filter);
    res.status(200).json({
        ok: true,
        message: "Products fetched successfully",
        data: products,
    });
});

export const productController = {
    addProduct,
    getProducts,
};