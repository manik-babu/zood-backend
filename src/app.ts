import express, { Application, Request, Response } from "express";
import dotenv from "dotenv"
import path from "node:path";
import cors from "cors"
import cookieParser from 'cookie-parser';
import apiRouter from "./routes";
import notFoundHandler from "./middlewares/notFound";
import globalErrorHandler from "./middlewares/globalError";

const app: Application = express();
dotenv.config({ path: path.join(process.cwd(), '.env') });
app.use(cors({
    origin: [process.env.FRONTEND_URL!],
    credentials: true
}))

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", apiRouter)

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        ok: true,
        message: "ZOOD Backend API is running successfully.",
        version: "1.0.0",
        time: new Date().toISOString()
    });
});

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;