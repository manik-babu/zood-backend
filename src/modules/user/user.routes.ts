import { Router } from "express";
import { userController } from "./user.controller";
import validateRequest from "../../middlewares/validator";
import { cartInputSchema } from "./user.validation";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";
//  /api/v1/users
const router = Router();
router.get("/products", userController.getProducts)
router.get("/products/:id", userController.getProductsById)
router.post("/carts", auth(UserRole.USER), validateRequest(cartInputSchema), userController.addToCart)
router.get("/carts", auth(UserRole.USER), userController.getCarts);


export const userRouter = router;


