import { Entity, World } from "../esc";

export abstract class ActionEffect {
    abstract act(self: Entity, world: World): boolean | Promise<boolean>;
    abstract serialize(): any;
}
