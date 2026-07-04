import { Router } from "express";
import { orderController } from "./order.controller";
import validateRequest from "../../middlewares/validator";
import { createOrderSchema } from "./order.validation";

// /api/v1/users/orders
const router = Router();

router.post("/", validateRequest(createOrderSchema), orderController.paceOrder);

export const orderRouter = router;