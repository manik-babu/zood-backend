import { Router } from 'express';
import { productRouter } from '../product/product.routes';

// /api/v1/admin -> adminRouter
const router = Router();

// Product Management
router.use("/products", productRouter);
// router.use("/orders", ordersRouter);

export const adminRouter = router;