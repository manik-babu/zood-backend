import * as z from "zod"

export const cartInputSchema = z.object({
    id: z.string().min(1, "product id is required!"),
    quantity: z.number().int(),
})