import * as z from "zod";

export const createOrderSchema = z.object({
    name: z.string().min(1, "Name is required"),
    phone: z.string().min(11, "Phone number must be at least 11 digits long").max(15, "Phone number must be at most 15 digits long"),
    address: z.string().min(1, "Address is required"),
});