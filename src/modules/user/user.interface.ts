
export interface FilterProducts {
    search: string;
    sort: "asc" | "desc";
    page: number;
    limit: number;
}