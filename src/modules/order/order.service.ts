import { prisma } from "../../lib/prisma";
import { CreateOrderInput } from "./order.interface";
import { nanoId } from "../../utils/nanoId";


const getCarts = async (userId: string) => {
    const carts = await prisma.cart.findMany({
        where: {
            userId: userId,
        },
        select: {
            id: true,
            quantity: true,
            product: {
                select: {
                    price: true,
                    discountPrice: true,
                },
            },
        },
    });
    const totalPrice = carts.reduce((acc, cart) => {
        const price = cart.product.discountPrice || cart.product.price;
        const total = parseFloat(price.toString()) * cart.quantity;
        return acc + total;
    }, 0);
    const formattedCarts = carts.map((cart) => cart.id);
    return { carts: formattedCarts, totalPrice };
}
const placeOrder = async (userId: string, data: CreateOrderInput, carts: string[], totalPrice: number) => {

    await prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
            data: {
                userId: userId,
                name: data.name,
                phone: data.phone,
                address: data.address,
                sku: nanoId(),
                totalPrice: totalPrice,
            }
        });
        await tx.cart.updateMany({
            where: {
                id: {
                    in: carts,
                },
            },
            data: {
                orderId: order.id,
            }
        })
    })
}
export const orderService = {
    getCarts,
    placeOrder,
}