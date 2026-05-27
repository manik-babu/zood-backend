import { prisma } from "../../lib/prisma";
import { AddProductInput } from "./product.validation";

const addProduct = async (data: AddProductInput) => {
    const product = await prisma.product.create({
        data: {
            name: data.name,
            description: data.description,
            price: data.price,
            discountPrice: data.discountPrice,
        },
    });
    return product;
}

export const productService = {
    addProduct,
};