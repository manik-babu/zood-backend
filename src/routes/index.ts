import { Router } from "express";


//? This file will be the main router that combines all the module-specific routers (auth, user, cart, etc.)
//? /api/v1/ -> apiRouter
const apiRouter = Router();


export default apiRouter;