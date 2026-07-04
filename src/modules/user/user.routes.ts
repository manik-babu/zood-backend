import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { cartRouter } from "../cart/cart.routes";
import { orderRouter } from "../order/order.routes";

//  /api/v1/users
const router = Router();

// Product management
router.get("/products", userController.getProducts)
router.get("/products/:id", userController.getProductsById)

// Cart management
router.use("/carts", auth(UserRole.USER), cartRouter);
router.use("/orders", auth(UserRole.USER), orderRouter);

export const userRouter = router;


