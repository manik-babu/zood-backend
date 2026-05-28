import { customAlphabet } from "nanoid";
import cloudinary, { upload } from "../../config/cloudinary";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { getPublicIdFromUrl } from "../../utils/getPublicId";
import { FilterProducts } from "./product.interface";
import { AddProductInput } from "./product.validation";

const addProduct = async (data: AddProductInput, images: { public_id: string; secure_url: string; }[]) => {
    const nanoid = customAlphabet(
        "ABCDEDGHIJKLMNPQURSTUVWXYZ123456789", 6
    )
    const product = await prisma.product.create({
        data: {
            name: data.name,
            sku: nanoid(),
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
const updateProduct = async (data: AddProductInput, id: string) => {
    const existingProduct = await prisma.product.count({
        where: {
            id: id,
        }
    });
    if (existingProduct === 0) {
        throw new AppError(404, "Product not found");
    }
    const updatedProduct = await prisma.product.update({
        where: {
            id: id,
        },
        data: data,
    });
    return updatedProduct;
}
const deleteProduct = async (id: string) => {
    const existingProduct = await prisma.product.count({
        where: {
            id: id,
        }
    });
    if (existingProduct === 0) {
        throw new AppError(404, "Product not found");
    }
    const product = await prisma.product.delete({
        where: {
            id: id,
        },
        include: {
            images: true,
        }
    }).then(async (pd) => {
        await Promise.all(pd.images.map(async (image) => {
            console.log("Deleting image from Cloudinary:", image.url);
            const publicId = getPublicIdFromUrl(image.url);
            return cloudinary.uploader.destroy(publicId);
        }));
        return pd;
    }).catch((error) => {
        console.log("Error deleting product:", error);
        throw new AppError(500, "Failed to delete product");
    });
    return product;
}

export const productService = {
    addProduct,
    getProducts,
    updateProduct,
    deleteProduct
};