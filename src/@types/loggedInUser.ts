export type LoggedInUser = {
    id: string;
    name: string;
    phone: string;
    role: "USER" | "ADMIN";
    email?: string;
}