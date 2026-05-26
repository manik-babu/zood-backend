import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { authService } from "./auth.service";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";

const signup = catchAsync(async (req: Request, res: Response) => {
    const data = req.body;
    const result = await authService.signup(data);
    res.status(201).json({
        ok: true,
        message: "Signup successful",
        data: result
    });

});
const login = catchAsync(async (req: Request, res: Response) => {
    const data = req.body;
    const user = await authService.login(data);
    const tokenData = {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        email: user.email
    }
    const token = jwt.sign(tokenData, env.JWT_SECRET, { expiresIn: "30d" });
    res.cookie("token", token, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
    res.status(200).json({
        ok: true,
        message: "Login successful",
        data: token
    });
});

export const authController = {
    signup,
    login
}