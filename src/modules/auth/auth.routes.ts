import { Request, Response, Router } from 'express';
import catchAsync from '../../utils/catchAsync';
import { authController } from './auth.controller';
import validateRequest from '../../middlewares/validator';
import { loginSchema, signupSchema } from './auth.validation';

// /api/v1/auth -> authRouter
const router = Router();

router.post("/signup", validateRequest(signupSchema), authController.signup);
router.post("/login", validateRequest(loginSchema), authController.login);

export const authRouter = router;