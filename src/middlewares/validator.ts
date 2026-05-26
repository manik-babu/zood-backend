import { NextFunction, Request, Response } from "express";
import * as z from "zod";

const validateRequest = (schema: z.ZodSchema | z.ZodArray<z.ZodTypeAny>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return next(result.error);
        }
        req.body = result.data;
        next();
    };
};

export default validateRequest;