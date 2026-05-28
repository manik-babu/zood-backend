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
        include: {
            images: {
                take: 1
            },
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
    const formattedProducts = products.map(p => (
        {
            ...p,
            images: p.images[0]?.url,
            _count: p._count.carts
        }
    ))
    return {
        products: formattedProducts,
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
const addToCart = async (payload: { id: string, quantity: number }, userId: string) => {
    const record = await prisma.product.count({
        where: {
            id: payload.id
        }
    })
    if (record === 0) {
        throw new AppError(404, "The product might no longer exists")
    }
    const userCarts = await prisma.cart.findFirst({
        where: {
            userId: userId,
            productId: payload.id
        },
        select: {
            id: true
        }
    })
    if (userCarts) {
        const cart = await prisma.cart.update({
            where: {
                id: userCarts.id,
            },
            data: {
                quantity: {
                    increment: payload.quantity
                }
            }
        })

        return cart.id
    }

    const cart = await prisma.cart.create({
        data: {
            productId: payload.id,
            quantity: payload.quantity,
            userId: userId
        }
    })

    return cart.id
}

export const userService = {
    getProducts,
    getProductsById,
    addToCart
};