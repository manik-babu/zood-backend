import { prisma } from "../../lib/prisma"
import AppError from "../../utils/AppError"

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
const getCarts = async (userId: string) => {
    const carts = await prisma.cart.findMany({
        where: {
            userId: userId,
            orderId: null
        },
        include: {
            product: {
                include: {
                    images: {
                        take: 1,
                        select: {
                            url: true,
                        }
                    }
                },
                omit: {
                    createdAt: true,
                    updatedAt: true,
                    description: true,
                    ratings: true,
                }
            }
        },
        omit: {
            createdAt: true,
            updatedAt: true,
            userId: true,
            productId: true,
            orderId: true,
        }
    });
    return carts;
}
const updateCarts = async (id: string, quantity: number, userId: string) => {
    const record = await prisma.cart.findUnique({
        where: {
            id: id,
            userId: userId
        },
        select: {
            userId: true,
        }
    });
    if (!record) {
        throw new AppError(404, "The cart might no longer exists");
    }
    await prisma.cart.update({
        where: {
            id: id
        },
        data: {
            quantity: quantity
        }
    });
    return null;
}
const deleteCart = async (cartId: string, userId: string) => {
    const cart = await prisma.cart.count({
        where: {
            id: cartId,
            userId: userId
        },
    });
    if (cart == 0) {
        throw new AppError(404, "The cart might no longer exits");
    }
    const ct = await prisma.cart.delete({
        where: {
            id: cartId,
            userId
        },
        select: {
            id: true
        }
    });
    return ct;
}

export const cartService = {
    addToCart,
    getCarts,
    updateCarts,
    deleteCart,
}