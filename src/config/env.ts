import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), ".env") });

type Env = {
    PORT: string;
    NODE_ENV: string;
    DATABASE_URL: string;
}
const requiredEnvs = [
    "PORT",
    "NODE_ENV",
    "DATABASE_URL"
];
requiredEnvs.forEach((env) => {
    if (!process.env[env]) {
        throw new Error(`Environment variable ${env} is required but not defined.`);
    }
});

export const env: Env = {
    PORT: process.env.PORT!,
    NODE_ENV: process.env.NODE_ENV!,
    DATABASE_URL: process.env.DATABASE_URL!
};