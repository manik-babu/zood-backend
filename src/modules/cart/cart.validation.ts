import * as z from "zod"

export const cartInputSchema = z.object({
    id: z.string().min(1, "product id is required!"),
    quantity: z.number().int(),
})
export const updateCartInputSchema = z.object({
    quantity: z.number().refine(q => (q > 0), {
        message: "Quantity must be a positive number"
    })
})