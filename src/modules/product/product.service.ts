import cloudinary, { upload } from "../../config/cloudinary";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { AddProductInput } from "./product.validation";

const addProduct = async (data: AddProductInput, images: { public_id: string; secure_url: string; }[]) => {
    const product = await prisma.product.create({
        data: {
            name: data.name,
            description: data.description,
            price: data.price,
            discountPrice: data.discountPrice,
            images: {
                create: images.map((image) => ({
                    url: image.secure_url
                })),
            },
        }
    }).catch(async (error) => {
        await Promise.all(images.map(async (image) => {
            return cloudinary.uploader.destroy(image.public_id);
        }));
        console.log("Error creating product:", error);
        throw new AppError(500, "Failed to create product");
    });
    return product;
}

export const productService = {
    addProduct,
};