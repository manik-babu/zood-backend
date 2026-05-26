import app from "./app";
import { env } from "./config/env";
import { prisma } from "./lib/prisma";

const PORT = env.PORT || 8080;
async function startServer() {
    try {
        await prisma.$connect();
        console.log("Connected to the database successfully.");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error starting server:", error);
        prisma.$disconnect();
        process.exit(1);
    }
}
startServer();