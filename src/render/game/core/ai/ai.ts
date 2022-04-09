import { Entity, World } from "../esc";

export type AI = (self: Entity, world: World) => boolean | Promise<boolean>;