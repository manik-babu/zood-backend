import * as z from "zod";

export const addProductSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    description: z.string().min(1, "Product description is required"),
    price: z.number().positive("Price must be a positive number"),
    discountPrice: z.number().positive("Discount price must be a positive number").nullable(),
});

export type AddProductInput = z.infer<typeof addProductSchema>;