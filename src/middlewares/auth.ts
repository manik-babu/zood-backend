import { NextFunction, Request, Response } from "express";
import { UserRole } from "../../generated/prisma/enums";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import status from "http-status";

export const auth = (...roles: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
            if (!token) {
                return res.status(status.UNAUTHORIZED).json({
                    ok: false,
                    message: "Unauthorized: No token provided",
                    data: null
                });
            }
            const decodedToken = jwt.verify(token, env.JWT_SECRET as string);
            if (decodedToken && typeof decodedToken === "object" && "role" in decodedToken) {
                const userRole = decodedToken.role as UserRole;
                if (!roles.includes(userRole)) {
                    return res.status(status.FORBIDDEN).json({
                        ok: false,
                        message: "Forbidden: You don't have permission to access this resource",
                        data: null
                    });
                }
            } else {
                return res.status(status.UNAUTHORIZED).json({
                    ok: false,
                    message: "Unauthorized: Invalid token",
                    data: null
                });
            }
            req.user = decodedToken as any;
            // Verify token and check roles here
            next();
        } catch (error) {
            console.error("Authorization error:", error);
            next(error);
        }
    };
}