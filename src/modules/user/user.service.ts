import status from "http-status";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { FilterProducts } from "./user.interface";

const getProducts = async (filter: FilterProducts) => {
    const products = await prisma.product.findMany({
        where: {
            name: {
                contains: filter.search,
                mode: "insensitive"
            },
        },
        orderBy: {
            price: filter.sort
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
const getProductsById = async (id: string) => {
    const record = await prisma.product.count({
        where: {
            id: id
        }
    })
    if (record === 0) {
        throw new AppError(status.NOT_FOUND, "The product is no longer exists.")
    }

    const pd = await prisma.product.findUnique({
        where: {
            id: id
        },
        include: {
            images: true,
            _count: {
                select: {
                    carts: {
                        where: {
                            orderId: {
                                not: null
                            }
                        }
                    }
                }
            }
        },
    });
    return pd;
}
export const userService = {
    getProducts,
    getProductsById,
};