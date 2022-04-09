import { Component } from "./component";
import { World } from "./world";

export type Constructor<T> = new (...args: any[]) => T;
export type System = (world: World) => void | Promise<void>;

export const fetchComponentId = <T extends Component>(component: T | Constructor<T> | string): string => {
    if (typeof component === 'function') {
        return component.name;
    } else if (typeof component === 'string') {
        return component;
    } else {
        return component.constructor.name;
    }
}