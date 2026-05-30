import { Router } from "express";
import validateRequest from "../../middlewares/validator";
import { cartInputSchema, updateCartInputSchema } from "./cart.validation";
import { cartController } from "./cart.controller";

// /api/v1/users/carts
const router = Router();

router.post("/", validateRequest(cartInputSchema), cartController.addToCart)
router.get("/", cartController.getCarts);
router.patch("/:id", validateRequest(updateCartInputSchema), cartController.updateCarts)
router.delete("/:id", cartController.deleteCart);

export const cartRouter = router;