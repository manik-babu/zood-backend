import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { cartService } from "./cart.service";


const addToCart = catchAsync(async (req: Request, res: Response,) => {
    const data = req.body;
    const userId = req.user?.id as string

    const result = await cartService.addToCart(data, userId);
    res.status(201).json({
        ok: true,
        message: "Product added to the cart!",
        data: result
    })
})
const getCarts = catchAsync(async (req: Request, res: Response,) => {
    const userId = req.user?.id as string;
    const carts = await cartService.getCarts(userId);
    res.status(200).json({
        ok: true,
        message: "Carts retrieved successfully",
        data: carts
    });
});
const updateCarts = catchAsync(async (req: Request, res: Response,) => {
    const { id } = req.params;
    const userId = req.user?.id as string;
    const { quantity } = req.body;
    await cartService.updateCarts(id as string, quantity, userId);
    res.status(200).json({
        ok: true,
        message: "Cart updated",
        data: null
    })
})
const deleteCart = catchAsync(async (req: Request, res: Response,) => {
    const { id } = req.params;
    const userId = req.user?.id as string;
    const ct = await cartService.deleteCart(id as string, userId)
    res.status(200).json({
        ok: true,
        message: "Cart deleted",
        data: ct
    });
})

export const cartController = {
    addToCart,
    getCarts,
    updateCarts,
    deleteCart,
}