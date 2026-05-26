import { UserRole } from "../../generated/prisma/enums";
import { env } from "../config/env";
import { prisma } from "../lib/prisma";


const seedAdmin = async () => {
    try {
        const data = {
            name: 'Admin',
            email: 'admin@example.com',
            phone: "01512345678",
            password: 'manik1234',
        }
        const response = await fetch(`${env.BACKEND_URL}/api/v1/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const res = await response.json();
        if (res.ok) {
            const admin = await prisma.user.update({
                where: {
                    phone: data.phone
                },
                data: {
                    role: UserRole.ADMIN
                },
            });
            console.log('Admin seeded successfully:', admin);
        }
        else {
            console.log('Failed to seed admin:', res.message);
        }
    }
    catch (error) {
        console.error('Error seeding admin:', error);
    }
}
seedAdmin();