import { AxiosError } from "axios";

export function rethrow(err: unknown): never {
    if (err instanceof AxiosError && err.response?.data.message) {
        throw new Error(err.response.data.message);
    } 
    if (err instanceof Error) {
        throw new Error(err.message);
    }
    throw new Error("Unknown error.");
}
