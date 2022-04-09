import { RNG } from "rot-js";

export const getRandomArrayElem = <T>(array: T[]): T => {
    const result = RNG.getItem(array);
    if (!result) throw new Error("Array is empty");
    return result;
}