import * as z from "zod";

export const signupSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address").nullable(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    phone: z.string().min(11, "Phone number must be at least 11 digits long")
});
export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
    phone: z.string().min(1, "Enter your phone number"),
    password: z.string().min(1, "Enter your password")
});
export type LoginInput = z.infer<typeof loginSchema>;
