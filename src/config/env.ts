import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), ".env") });

type Env = {
    PORT: string;
    NODE_ENV: string;
    DATABASE_URL: string;
    JWT_SECRET: string;
    BACKEND_URL: string;
    FRONTEND_URL: string;
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    CLOUDINARY_FOLDER: string;
}
const requiredEnvs = [
    "PORT",
    "NODE_ENV",
    "DATABASE_URL",
    "JWT_SECRET",
    "BACKEND_URL",
    "FRONTEND_URL",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "CLOUDINARY_FOLDER"
];
requiredEnvs.forEach((env) => {
    if (!process.env[env]) {
        throw new Error(`Environment variable ${env} is required but not defined.`);
    }
});

export const env: Env = {
    PORT: process.env.PORT!,
    NODE_ENV: process.env.NODE_ENV!,
    DATABASE_URL: process.env.DATABASE_URL!,
    JWT_SECRET: process.env.JWT_SECRET!,
    BACKEND_URL: process.env.BACKEND_URL!,
    FRONTEND_URL: process.env.FRONTEND_URL!,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET!,
    CLOUDINARY_FOLDER: process.env.CLOUDINARY_FOLDER!,
};