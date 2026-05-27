import { Router } from "express";
import { authRouter } from "../modules/auth/auth.routes";
import { adminRouter } from "../modules/admin/admin.routes";
import { auth } from "../middlewares/auth";
import { UserRole } from "../../generated/prisma/enums";
import { productRouter } from "../modules/product/product.routes";


//? This file will be the main router that combines all the module-specific routers (auth, user, cart, etc.)
//? /api/v1/ -> apiRouter
const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/admin", auth(UserRole.ADMIN), adminRouter);

export default apiRouter;