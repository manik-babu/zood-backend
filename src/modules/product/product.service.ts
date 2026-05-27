import cloudinary, { upload } from "../../config/cloudinary";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { FilterProducts } from "./product.interface";
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
const getProducts = async (filter: FilterProducts) => {
    const products = await prisma.product.findMany({
        where: {
            name: {
                contains: filter.search,
                mode: "insensitive"
            },
            ...(filter.status != "ALL" && { status: filter.status }),

        },
        orderBy: {
            createdAt: filter.sort
        },
        skip: (filter.page - 1) * filter.limit,
        take: filter.limit,
    });
    const total = await prisma.product.count({
        where: {
            name: {
                contains: filter.search,
                mode: "insensitive"
            },
            ...(filter.status != "ALL" && { status: filter.status }),
        },
    });
    return {
        products,
        meta: {
            total: total,
            page: filter.page,
            limit: filter.limit,
            totalPages: Math.ceil(total / filter.limit),
        }
    };
}

export const productService = {
    addProduct,
    getProducts,
};