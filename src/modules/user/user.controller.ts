import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { FilterProducts } from "./user.interface";
import { userService } from "./user.service";

const getProducts = catchAsync(async (req: Request, res: Response) => {
    const filter: FilterProducts = {
        search: (req.query.search as string) || "",
        sort: (req.query.sort as "asc" | "desc") || "desc",
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
    }
    const products = await userService.getProducts(filter);
    res.status(200).json({
        ok: true,
        message: "Products fetched successfully",
        data: products,
    });
});
const getProductsById = catchAsync(async (req: Request, res: Response,) => {
    const { id } = req.params;
    const pd = await userService.getProductsById(id as string);
    res.status(200).json({
        ok: true,
        message: "Product retrieved successfully",
        data: pd
    })
})

const addToCart = catchAsync(async (req: Request, res: Response,) => {
    const data = req.body;
    const userId = req.user?.id as string

    const result = await userService.addToCart(data, userId);
    res.status(201).json({
        ok: true,
        message: "Product added to the cart!",
        data: result
    })
})
export const userController = {
    getProducts,
    getProductsById,
    addToCart
}