import { Router } from "express";
import validateRequest from "../../middlewares/validator";
import { addProductSchema } from "./product.validation";
import { productController } from "./product.controller";

// /api/v1/admin/products -> productRouter
const router = Router();

router.post("/", validateRequest(addProductSchema), productController.addProduct);


export const productRouter = router;