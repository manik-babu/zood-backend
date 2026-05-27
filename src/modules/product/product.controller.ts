import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { productService } from "./product.service";


const addProduct = catchAsync(async (req: Request, res: Response,) => {
    const data = req.body;

    const product = await productService.addProduct(data);

    res.status(201).json({
        ok: true,
        message: "Product added successfully",
        data: product,
    });
});
export const productController = {
    addProduct,
};