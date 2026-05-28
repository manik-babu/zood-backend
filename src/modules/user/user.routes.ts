import { Router } from "express";
import { userController } from "./user.controller";
//  /api/v1/users
const router = Router();
router.get("/products", userController.getProducts)
export const userRouter = router;


