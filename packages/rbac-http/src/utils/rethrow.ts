import { AxiosError } from "axios";

export const rethrow = (target: Function) => async function (this: unknown, ...args: unknown[]) {
  try {
    return await target.call(this, ...args);
  } catch (err) {
    if (err instanceof AxiosError && err.response?.data.message) {
      throw new Error(err.response.data.message);
    }
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw new Error("Unknown error.");
  }
}
