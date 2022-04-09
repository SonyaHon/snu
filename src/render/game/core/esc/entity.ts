import { nanoid } from "nanoid";
import { Component } from "./component";
import { Constructor } from "./utils";

export const AddEntry = <T extends Component, J extends Constructor<T>>(component: J, args: ConstructorParameters<J>): [Constructor<Component>, any[]] => {
    return [component, args];
}

export class Entity {
    private readonly id: string;

    constructor(id?: string) {
        this.id = id ? id : nanoid();
    }

    getId() {
        return this.id;
    }

    static CreateTemplate(...entries: [Constructor<Component>, any[]][]): [Constructor<Component>, any[]][] {
        return entries;
    }
}