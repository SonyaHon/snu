import { DisplayManager } from "../display";
import { System } from "../esc";

export const SysClearScreen: System = () => {
    DisplayManager.clearScreen();
}