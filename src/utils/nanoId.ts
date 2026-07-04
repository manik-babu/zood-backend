import { customAlphabet } from "nanoid";


export const nanoId = customAlphabet(
    "ABCDEDGHIJKLMNPQURSTUVWXYZ123456789",
    6
);