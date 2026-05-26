import { Router } from "express";
import { authRouter } from "../modules/auth/auth.routes";


//? This file will be the main router that combines all the module-specific routers (auth, user, cart, etc.)
//? /api/v1/ -> apiRouter
const apiRouter = Router();

apiRouter.use("/auth", authRouter);

export default apiRouter;