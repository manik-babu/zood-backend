import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { orderService } from "./order.service";
import AppError from "../../utils/AppError";


const paceOrder = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const data = req.body;
    const { carts, totalPrice } = await orderService.getCarts(userId);
    if (carts.length === 0) {
        throw new AppError(400, "Cart is empty");
    }
    await orderService.placeOrder(userId, data, carts, totalPrice);
    res.status(200).json({
        ok: true,
        message: "Order placed successfully",
    })
})

export const orderController = {
    paceOrder,
}