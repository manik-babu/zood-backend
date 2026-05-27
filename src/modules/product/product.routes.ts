import { Router } from "express";
import validateRequest from "../../middlewares/validator";
import { addProductSchema } from "./product.validation";
import { productController } from "./product.controller";
import { upload } from "../../config/cloudinary";

// /api/v1/admin/products -> productRouter
const router = Router();

router.post("/", upload.array("images", 5), productController.addProduct);
router.get("/", productController.getProducts);

export const productRouter = router;