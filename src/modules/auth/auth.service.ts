import status from "http-status";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { LoginInput, SignupInput } from "./auth.validation";
import bcrypt from "bcryptjs";


const signup = async (data: SignupInput) => {
    const isExists = await prisma.user.count({
        where: {
            phone: data.phone,
            ...(data.email != null && { email: data.email })
        }
    });
    if (isExists) {
        throw new AppError(status.BAD_REQUEST, "Phone number or email already exists");
    }
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);
    const user = await prisma.user.create({
        data: {
            name: data.name,
            phone: data.phone,
            email: data.email,
            password: data.password
        }
    });
    return user;
}
const login = async (data: LoginInput) => {
    const user = await prisma.user.findFirst({
        where: {
            phone: data.phone
        }
    });
    if (!user) {
        throw new AppError(status.BAD_REQUEST, "Invalid phone number or password");
    }
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
        throw new AppError(status.BAD_REQUEST, "Invalid phone number or password");
    }
    return user;
}

export const authService = {
    signup,
    login,
}