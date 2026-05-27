import { ProductStatus } from "../../../generated/prisma/enums";

export interface FilterProducts {
    search: string;
    status: ProductStatus | "ALL";
    sort: "asc" | "desc";
    page: number;
    limit: number;
}